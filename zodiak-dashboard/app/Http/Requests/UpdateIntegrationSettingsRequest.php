<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateIntegrationSettingsRequest extends FormRequest
{
    /**
     * Any signed-in Op-Center user may manage integrations; the route is behind auth:web.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Field names arrive with dots replaced by "__" (e.g. "anthropic__api_key"), since PHP form keys can't contain dots.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = ['clear' => ['array'], 'clear.*' => ['string']];

        foreach (config('integrations') as $integration) {
            foreach ($integration['fields'] as $key => $field) {
                $rules[str_replace('.', '__', $key)] = match (true) {
                    ($field['type'] ?? null) === 'boolean' => ['nullable', 'in:0,1'],
                    str_ends_with($key, 'base_url') => ['nullable', 'url:https', 'max:255'],
                    $key === 'pinelabs.environment' => ['nullable', 'in:uat,production'],
                    $key === 'ai.provider' => ['nullable', 'in:gemini,claude'],
                    in_array($key, ['credits.signup_bonus', 'credits.per_question', 'credits.per_palm_reading'], true) => ['nullable', 'integer', 'min:0', 'max:10000'],
                    $key === 'credits.packs' => ['nullable', 'regex:/^\s*\d+\s*[=:]\s*\d+\s*(,\s*\d+\s*[=:]\s*\d+\s*)*$/', 'max:255'],
                    $key === 'upi.vpa' => ['nullable', 'regex:/^[A-Za-z0-9.\-_]{2,256}@[A-Za-z]{2,64}$/'],
                    default => ['nullable', 'string', 'max:500'],
                };
            }
        }

        return $rules;
    }
}
