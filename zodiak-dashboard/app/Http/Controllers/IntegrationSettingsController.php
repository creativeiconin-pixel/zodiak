<?php

namespace App\Http\Controllers;

use App\Actions\ApplyIntegrationSettings;
use App\Actions\RecordAuditLog;
use App\Enums\ActorType;
use App\Http\Requests\UpdateIntegrationSettingsRequest;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\View\View;

class IntegrationSettingsController extends Controller
{
    public function edit(): View
    {
        $saved = Setting::all()->keyBy('key');

        $integrations = collect(config('integrations'))->map(fn (array $integration) => [
            ...$integration,
            'fields' => collect($integration['fields'])->map(function (array $field, string $key) use ($saved) {
                $setting = $saved->get($key);
                $isBoolean = ($field['type'] ?? null) === 'boolean';
                $current = $isBoolean ? (config($field['config']) ? '1' : '0') : (string) config($field['config']);

                return [
                    ...$field,
                    'input' => str_replace('.', '__', $key),
                    'type' => $field['type'] ?? 'text',
                    'source' => $setting ? 'dashboard' : ($isBoolean || filled($current) ? 'env' : 'missing'),
                    // Secrets are never sent back to the browser; only the last 4 characters are shown
                    'display' => $field['secret'] ? ($current !== '' ? '•••• '.Str::substr($current, -4) : '') : $current,
                    'updated_at' => $setting?->updated_at,
                ];
            })->all(),
        ])->all();

        return view('settings.integrations', ['integrations' => $integrations]);
    }

    /**
     * Save filled-in fields. Blank secret fields keep their current value; "clear" removes a dashboard value so .env applies again.
     */
    public function update(UpdateIntegrationSettingsRequest $request, ApplyIntegrationSettings $applyIntegrationSettings, RecordAuditLog $recordAuditLog): RedirectResponse
    {
        $user = $request->user();
        $changed = [];

        DB::transaction(function () use ($request, $user, &$changed): void {
            foreach (config('integrations') as $integration) {
                foreach ($integration['fields'] as $key => $field) {
                    $input = str_replace('.', '__', $key);
                    $value = trim((string) $request->validated($input));
                    $isBoolean = ($field['type'] ?? null) === 'boolean';
                    $current = $isBoolean ? (config($field['config']) ? '1' : '0') : (string) config($field['config']);

                    if (in_array($key, $request->validated('clear', []), true)) {
                        Setting::where('key', $key)->delete() && $changed[] = "{$field['label']} cleared";
                    } elseif ($value !== '' && ($field['secret'] || $value !== $current)) {
                        Setting::updateOrCreate(['key' => $key], ['value' => $value, 'updated_by' => $user->id]);
                        $changed[] = $field['label'].' updated';
                    }
                }
            }
        });

        if ($changed === []) {
            return back()->with('status', 'Nothing changed.');
        }

        $applyIntegrationSettings->refresh();
        $recordAuditLog->handle($user->name, ActorType::Pandit, 'Integration Settings Changed', '#SETTINGS', implode('; ', $changed).'. Values are not logged.');

        return back()->with('status', 'Integration settings saved.');
    }
}
