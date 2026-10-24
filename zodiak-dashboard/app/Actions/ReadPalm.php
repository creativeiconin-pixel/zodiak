<?php

namespace App\Actions;

use Anthropic\Client;
use RuntimeException;

/**
 * Sends a palm photo to the configured AI (Gemini or Claude) and returns the structured palm reading.
 *
 * Kept as its own class so the HTTP layer can be tested without calling the API.
 */
class ReadPalm
{
    private ?Client $client = null;

    public function isConfigured(): bool
    {
        return $this->usesGemini() ? app(GeminiClient::class)->isConfigured() : filled(config('services.anthropic.key'));
    }

    private function usesGemini(): bool
    {
        return config('services.ai.provider') === 'gemini';
    }

    /**
     * @param  list<array{type: string, text: string, cacheControl?: array<string, string>}>  $system  The instructions, including the reply language.
     * @param  string  $imageData  Raw image bytes, held in memory only and never stored.
     * @param  string  $mediaType  One of image/jpeg, image/png, image/webp.
     * @param  array<string, mixed>  $schema
     * @return array<string, mixed>|null The decoded reading, or null when the model declined.
     */
    public function read(array $system, string $imageData, string $mediaType, string $prompt, array $schema): ?array
    {
        if ($this->usesGemini()) {
            return app(GeminiClient::class)->json(
                collect($system)->pluck('text')->implode("\n\n"),
                [['role' => 'user', 'content' => $prompt]],
                $schema,
                ['data' => $imageData, 'mime_type' => $mediaType],
            );
        }

        $client = $this->client ??= new Client(apiKey: config('services.anthropic.key'));

        $message = $client->beta->messages->create(
            maxTokens: 16000,
            messages: [[
                'role' => 'user',
                'content' => [
                    ['type' => 'image', 'source' => ['type' => 'base64', 'mediaType' => $mediaType, 'data' => base64_encode($imageData)]],
                    ['type' => 'text', 'text' => $prompt],
                ],
            ]],
            model: config('services.anthropic.model'),
            system: $system,
            outputConfig: [
                'effort' => 'medium',
                'format' => ['type' => 'json_schema', 'schema' => $schema],
            ],
            // If the main model declines on policy grounds, the API retries on its default fallback model.
            fallbacks: 'default',
            betas: ['server-side-fallback-2026-07-01'],
        );

        if ($message->stopReason === 'refusal') {
            return null;
        }

        foreach ($message->content as $block) {
            if ($block->type === 'text') {
                $decoded = json_decode($block->text, true);

                if (! is_array($decoded)) {
                    throw new RuntimeException('Claude returned a palm reading that is not valid JSON.');
                }

                return $decoded;
            }
        }

        throw new RuntimeException('Claude returned no palm reading text.');
    }
}
