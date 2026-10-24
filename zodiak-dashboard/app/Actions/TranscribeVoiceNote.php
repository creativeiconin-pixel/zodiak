<?php

namespace App\Actions;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use RuntimeException;

/**
 * Turns a voice note into text on the server, for phones whose browser can't do speech-to-text
 * (iPhones, installed apps, many Android phones while the mic is recording).
 */
class TranscribeVoiceNote
{
    private const LANGUAGE_HINTS = [
        'en' => 'They usually speak English or Hindi; write Hindi in Devanagari script.',
        'hi' => 'They usually speak Hindi; write it in Devanagari script.',
        'hinglish' => 'They usually speak Hinglish; write it in English (Roman) letters, the way people text in India.',
        'kn' => 'They usually speak Kannada; write it in Kannada script.',
    ];

    public function __construct(private GeminiClient $gemini) {}

    public function isAvailable(): bool
    {
        return $this->gemini->isConfigured();
    }

    public function handle(UploadedFile $audio, string $locale): ?string
    {
        if (! $this->isAvailable()) {
            return null;
        }

        // Browsers label recordings as video/webm or video/mp4; Gemini wants the audio type
        $mimeType = str_replace('video/', 'audio/', (string) $audio->getMimeType());

        try {
            return $this->gemini->transcribe($audio->getContent(), $mimeType, self::LANGUAGE_HINTS[$locale] ?? self::LANGUAGE_HINTS['en']);
        } catch (RuntimeException $exception) {
            Log::warning('Voice note transcription failed', ['mime' => $mimeType, 'error' => $exception->getMessage()]);

            return null;
        }
    }
}
