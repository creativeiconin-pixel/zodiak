<?php

namespace App\Actions;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * Calls Google Gemini (generateContent) and returns a JSON answer that follows the given schema.
 *
 * @see https://ai.google.dev/api/generate-content
 */
class GeminiClient
{
    public function isConfigured(): bool
    {
        return filled(config('services.gemini.key'));
    }

    /**
     * @param  string  $system  Instructions for the model.
     * @param  list<array{role: string, content: string}>  $messages  Conversation, oldest first; role is "user" or "assistant".
     * @param  array<string, mixed>  $schema  JSON Schema for the reply.
     * @param  array{data: string, mime_type: string}|null  $image  Raw image bytes to attach to the last user message.
     * @return array<string, mixed>|null The decoded answer, or null when Gemini blocked the request for safety.
     */
    public function json(string $system, array $messages, array $schema, ?array $image = null): ?array
    {
        $contents = array_map(fn (array $message) => [
            'role' => $message['role'] === 'assistant' ? 'model' : 'user',
            'parts' => [['text' => $message['content']]],
        ], $messages);

        if ($image !== null && $contents !== []) {
            array_unshift($contents[array_key_last($contents)]['parts'], ['inline_data' => ['mime_type' => $image['mime_type'], 'data' => base64_encode($image['data'])]]);
        }

        $model = config('services.gemini.model') ?: 'gemini-flash-lite-latest';

        try {
            $response = Http::withHeaders(['x-goog-api-key' => config('services.gemini.key')])
                ->acceptJson()
                ->timeout(45)
                ->post("https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent", [
                    'system_instruction' => ['parts' => [['text' => $system]]],
                    'contents' => $contents,
                    'generationConfig' => [
                        'responseMimeType' => 'application/json',
                        'responseJsonSchema' => $schema,
                    ],
                ]);
        } catch (ConnectionException $exception) {
            throw new RuntimeException('Gemini did not respond: '.$exception->getMessage());
        }

        if ($response->failed()) {
            throw new RuntimeException("Gemini returned HTTP {$response->status()}: ".($response->json('error.message') ?? 'unknown error'));
        }

        if ($response->json('promptFeedback.blockReason') || in_array($response->json('candidates.0.finishReason'), ['SAFETY', 'PROHIBITED_CONTENT', 'BLOCKLIST', 'SPII'], true)) {
            return null;
        }

        // Skip any "thought" parts and join the visible text
        $text = collect($response->json('candidates.0.content.parts', []))
            ->reject(fn (array $part) => $part['thought'] ?? false)
            ->pluck('text')
            ->implode('');

        $decoded = json_decode($text, true);

        if (! is_array($decoded)) {
            throw new RuntimeException('Gemini returned an answer that is not valid JSON.');
        }

        return $decoded;
    }

    /**
     * Write down the words spoken in a voice note. Returns null when nothing clear was said.
     */
    public function transcribe(string $audio, string $mimeType, string $languageHint): ?string
    {
        $model = config('services.gemini.model') ?: 'gemini-flash-lite-latest';

        try {
            $response = Http::withHeaders(['x-goog-api-key' => config('services.gemini.key')])
                ->acceptJson()
                ->timeout(30)
                ->post("https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent", [
                    'contents' => [[
                        'role' => 'user',
                        'parts' => [
                            ['inline_data' => ['mime_type' => $mimeType, 'data' => base64_encode($audio)]],
                            ['text' => "Write down exactly what the speaker says in this voice note, in the language they speak. {$languageHint} Reply with only the words, no quotes or notes. If there is no clear speech, reply with an empty JSON string."],
                        ],
                    ]],
                    'generationConfig' => [
                        'responseMimeType' => 'application/json',
                        'responseJsonSchema' => ['type' => 'object', 'properties' => ['text' => ['type' => 'string']], 'required' => ['text']],
                    ],
                ]);
        } catch (ConnectionException $exception) {
            throw new RuntimeException('Gemini did not respond: '.$exception->getMessage());
        }

        if ($response->failed()) {
            throw new RuntimeException("Gemini returned HTTP {$response->status()}: ".($response->json('error.message') ?? 'unknown error'));
        }

        $text = collect($response->json('candidates.0.content.parts', []))
            ->reject(fn (array $part) => $part['thought'] ?? false)
            ->pluck('text')
            ->implode('');

        $words = trim((string) (json_decode($text, true)['text'] ?? ''));

        return $words === '' ? null : mb_substr($words, 0, 1000);
    }
}
