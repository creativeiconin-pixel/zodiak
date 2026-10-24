<?php

namespace App\Actions;

use Anthropic\Client;
use RuntimeException;

/**
 * Sends one Ask-AI turn to the configured AI (Gemini or Claude) and returns the structured answer.
 *
 * Kept as its own class so the HTTP layer can be tested without calling the API.
 */
class AskClaude
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
     * @param  list<array{type: string, text: string, cacheControl?: array<string, string>}>  $system
     * @param  list<array{role: string, content: string}>  $messages
     * @param  array<string, mixed>  $schema
     * @return array<string, mixed>|null The decoded answer, or null when the model declined to answer.
     */
    public function answer(array $system, array $messages, array $schema): ?array
    {
        if ($this->usesGemini()) {
            return app(GeminiClient::class)->json(collect($system)->pluck('text')->implode("\n\n"), $messages, $schema);
        }

        $client = $this->client ??= new Client(apiKey: config('services.anthropic.key'));

        $message = $client->beta->messages->create(
            maxTokens: 16000,
            messages: $messages,
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
                    throw new RuntimeException('Claude returned an answer that is not valid JSON.');
                }

                return $decoded;
            }
        }

        throw new RuntimeException('Claude returned no answer text.');
    }
}
