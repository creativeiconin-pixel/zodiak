<?php

namespace App\Actions;

use Anthropic\Client;
use Anthropic\Core\Exceptions\APIConnectionException;
use Anthropic\Core\Exceptions\APIStatusException;
use Anthropic\Core\Exceptions\AuthenticationException;
use App\Exceptions\PineLabsException;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;

/**
 * Makes one harmless, read-only call to an integration to confirm the saved credentials work.
 */
class TestIntegrationConnection
{
    /**
     * @return array{ok: bool, message: string}
     */
    public function handle(string $integration): array
    {
        return match ($integration) {
            'anthropic' => $this->anthropic(),
            'gemini' => $this->gemini(),
            'agenticorg' => $this->agenticOrg(),
            'elevenlabs' => $this->elevenLabs(),
            'pinelabs' => $this->pineLabs(),
            default => ['ok' => false, 'message' => 'This integration has no connection test yet.'],
        };
    }

    /**
     * @return array{ok: bool, message: string}
     */
    private function anthropic(): array
    {
        if (blank(config('services.anthropic.key'))) {
            return ['ok' => false, 'message' => 'No API key saved.'];
        }

        try {
            $model = (new Client(apiKey: config('services.anthropic.key')))->models->retrieve(config('services.anthropic.model'));

            return ['ok' => true, 'message' => "Connected. Model {$model->id} is available."];
        } catch (AuthenticationException) {
            return ['ok' => false, 'message' => 'The API key was rejected (401).'];
        } catch (APIStatusException $exception) {
            return ['ok' => false, 'message' => "Claude API returned an error ({$exception->status})."];
        } catch (APIConnectionException) {
            return ['ok' => false, 'message' => 'Could not reach the Claude API.'];
        }
    }

    /**
     * @return array{ok: bool, message: string}
     */
    private function agenticOrg(): array
    {
        $baseUrl = rtrim((string) config('services.agenticorg.base_url'), '/');

        if (blank(config('services.agenticorg.key')) || $baseUrl === '') {
            return ['ok' => false, 'message' => 'Base URL and API key are both needed.'];
        }

        try {
            $response = Http::withToken(config('services.agenticorg.key'))->acceptJson()->timeout(15)->get("{$baseUrl}/api/v1/agents");
        } catch (ConnectionException) {
            return ['ok' => false, 'message' => "Could not reach {$baseUrl}."];
        }

        return match (true) {
            $response->successful() => ['ok' => true, 'message' => 'Connected. '.count($response->json('agents', $response->json()) ?? []).' agents visible to this key.'],
            $response->status() === 401 => ['ok' => false, 'message' => 'The API key was rejected (401: '.($response->json('detail') ?? 'unauthorized').').'],
            $response->status() === 403 => ['ok' => false, 'message' => 'The key works but lacks the agents:read scope (403).'],
            default => ['ok' => false, 'message' => "AgenticOrg returned HTTP {$response->status()}."],
        };
    }

    /**
     * @return array{ok: bool, message: string}
     */
    private function elevenLabs(): array
    {
        if (blank(config('services.elevenlabs.key'))) {
            return ['ok' => false, 'message' => 'No API key saved.'];
        }

        try {
            $response = Http::withHeaders(['xi-api-key' => config('services.elevenlabs.key')])->acceptJson()->timeout(15)->get('https://api.elevenlabs.io/v1/user');
        } catch (ConnectionException) {
            return ['ok' => false, 'message' => 'Could not reach ElevenLabs.'];
        }

        if (! $response->successful()) {
            return ['ok' => false, 'message' => $response->status() === 401 ? 'The API key was rejected (401).' : "ElevenLabs returned HTTP {$response->status()}."];
        }

        $used = $response->json('subscription.character_count');
        $limit = $response->json('subscription.character_limit');
        $voice = filled(config('services.elevenlabs.voice_id')) ? '' : ' Add a Voice ID to turn on voice replies.';

        return ['ok' => true, 'message' => 'Connected'.($limit ? " ({$used} / {$limit} characters used this month)." : '.').$voice];
    }

    /**
     * Generates an OAuth token — the lightest call that proves the client ID and secret are valid.
     *
     * @return array{ok: bool, message: string}
     */
    private function pineLabs(): array
    {
        if (blank(config('services.pinelabs.client_id')) || blank(config('services.pinelabs.client_secret'))) {
            return ['ok' => false, 'message' => 'Client ID and client secret are both needed.'];
        }

        try {
            app(PineLabsClient::class)->accessToken(fresh: true);
        } catch (PineLabsException $exception) {
            return ['ok' => false, 'message' => $exception->getMessage()];
        }

        return ['ok' => true, 'message' => 'Connected to Pine Labs ('.config('services.pinelabs.environment').'). Token generated.'];
    }

    /**
     * Lists models — a read-only call that proves the key is accepted — and checks the chosen model exists.
     *
     * @return array{ok: bool, message: string}
     */
    private function gemini(): array
    {
        if (blank(config('services.gemini.key'))) {
            return ['ok' => false, 'message' => 'No API key saved.'];
        }

        try {
            $response = Http::withHeaders(['x-goog-api-key' => config('services.gemini.key')])->acceptJson()->timeout(15)->get('https://generativelanguage.googleapis.com/v1beta/models', ['pageSize' => 100]);
        } catch (ConnectionException) {
            return ['ok' => false, 'message' => 'Could not reach Google Gemini.'];
        }

        if ($response->failed()) {
            return ['ok' => false, 'message' => 'Gemini rejected the key ('.$response->status().': '.($response->json('error.message') ?? 'error').').'];
        }

        $model = 'models/'.(config('services.gemini.model') ?: 'gemini-flash-lite-latest');
        $available = collect($response->json('models', []))->pluck('name');

        return $available->contains($model)
            ? ['ok' => true, 'message' => "Connected. {$model} is available."]
            : ['ok' => false, 'message' => "Key works, but {$model} is not in this key's model list."];
    }
}
