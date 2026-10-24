<?php

namespace App\Actions;

use App\Models\Setting;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Cache;

/**
 * Overlays integration values saved in the dashboard onto the running config, so code keeps reading config('services.*').
 */
class ApplyIntegrationSettings
{
    public const CACHE_KEY = 'integration-settings';

    public function handle(): void
    {
        foreach ($this->savedValues() as $key => $encryptedValue) {
            $field = $this->field($key);

            if ($field !== null) {
                $value = decrypt($encryptedValue);
                config([$field['config'] => ($field['type'] ?? null) === 'boolean' ? $value === '1' : $value]);
            }
        }
    }

    /**
     * Forget the cached values and re-apply them, e.g. after the settings page saves.
     */
    public function refresh(): void
    {
        Cache::forget(self::CACHE_KEY);
        $this->handle();
    }

    /**
     * Saved values keyed by setting key, each still encrypted.
     *
     * @return array<string, string>
     */
    private function savedValues(): array
    {
        try {
            // Cached encrypted, so the plain secrets never sit in the cache store
            return Cache::rememberForever(self::CACHE_KEY, fn (): array => Setting::all()->pluck('value', 'key')->map(fn (string $value) => encrypt($value))->all());
        } catch (QueryException) {
            return []; // settings table not migrated yet (fresh install, tests booting)
        }
    }

    /**
     * @return array{config: string, type?: string}|null
     */
    private function field(string $key): ?array
    {
        foreach (config('integrations') as $integration) {
            if (isset($integration['fields'][$key])) {
                return $integration['fields'][$key];
            }
        }

        return null;
    }
}
