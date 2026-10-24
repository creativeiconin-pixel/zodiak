<?php

namespace App\Actions;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Turns an AI answer into a voice note with ElevenLabs, so replies to voice questions come back as audio.
 *
 * @see https://elevenlabs.io/docs/api-reference/text-to-speech/convert
 */
class SynthesizeVoiceReply
{
    /** 64 kbps MP3 keeps notes small on mobile data. */
    private const OUTPUT_FORMAT = 'mp3_44100_64';

    private const BYTES_PER_SECOND = 64000 / 8;

    /** ElevenLabs language codes; Hinglish is Roman-script Hindi, which the model detects best on its own. */
    private const LANGUAGE_CODES = ['en' => 'en', 'hi' => 'hi', 'kn' => 'kn', 'hinglish' => null];

    public function isConfigured(): bool
    {
        return filled(config('services.elevenlabs.key')) && filled(config('services.elevenlabs.voice_id'));
    }

    /**
     * @return array{path: string, duration_ms: int, waveform: list<float>}|null Null when not configured or ElevenLabs failed.
     */
    public function handle(string $text, string $locale, string $directory): ?array
    {
        if (! $this->isConfigured() || trim($text) === '') {
            return null;
        }

        try {
            $response = Http::withHeaders(['xi-api-key' => config('services.elevenlabs.key')])
                ->accept('audio/mpeg')
                ->timeout(45)
                ->post('https://api.elevenlabs.io/v1/text-to-speech/'.rawurlencode(config('services.elevenlabs.voice_id')).'?output_format='.self::OUTPUT_FORMAT, array_filter([
                    'text' => Str::limit($text, 2500, ''),
                    'model_id' => config('services.elevenlabs.model_id') ?: 'eleven_v3',
                    'language_code' => self::LANGUAGE_CODES[$locale] ?? null,
                ]));
        } catch (ConnectionException $exception) {
            Log::warning('ElevenLabs unreachable', ['error' => $exception->getMessage()]);

            return null;
        }

        if ($response->failed()) {
            Log::warning('ElevenLabs voice reply failed', ['status' => $response->status(), 'body' => Str::limit($response->body(), 300)]);

            return null;
        }

        $path = $directory.'/reply-'.Str::uuid().'.mp3';
        Storage::disk('local')->put($path, $response->body());

        return [
            'path' => $path,
            'duration_ms' => (int) round(strlen($response->body()) / self::BYTES_PER_SECOND * 1000),
            'waveform' => $this->waveform($text),
        ];
    }

    /**
     * Stable decorative bars for the voice-note bubble, derived from the text.
     *
     * @return list<float>
     */
    private function waveform(string $text): array
    {
        $seed = crc32($text);

        return array_map(function () use (&$seed): float {
            $seed = ($seed * 1103515245 + 12345) & 0x7FFFFFFF;

            return round(0.25 + ($seed % 1000) / 1333, 2);
        }, range(1, 40));
    }
}
