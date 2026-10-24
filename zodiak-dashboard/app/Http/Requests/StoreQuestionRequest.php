<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreQuestionRequest extends FormRequest
{
    /**
     * The route is behind auth:sanctum; any signed-in seeker may ask about their own chart.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Voice notes arrive as multipart form data, where the chart and waveform are JSON strings.
     */
    protected function prepareForValidation(): void
    {
        foreach (['chart', 'waveform'] as $field) {
            if (is_string($this->input($field))) {
                $this->merge([$field => json_decode($this->input($field), true)]);
            }
        }
    }

    /**
     * The chart is computed in the app from the seeker's saved birth details and sent in English.
     * For a voice note, "message" is the transcript made on the device while recording; when the device
     * could not make one it is left out and the server writes the words down instead.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'message' => ['required_without:audio', 'nullable', 'string', 'max:1000'],
            'audio' => ['nullable', 'file', 'mimetypes:audio/webm,video/webm,audio/ogg,audio/mp4,video/mp4,audio/x-m4a,audio/m4a,audio/mpeg,audio/wav,audio/x-wav,audio/aac,video/quicktime', 'max:5120'],
            'audio_duration_ms' => ['required_with:audio', 'integer', 'between:300,300000'],
            'waveform' => ['nullable', 'array', 'max:64'],
            'waveform.*' => ['numeric', 'between:0,1'],
            'chart' => ['nullable', 'array'],
            'chart.ascendant' => ['required_with:chart', 'string', 'max:60'],
            'chart.moon_nakshatra' => ['required_with:chart', 'string', 'max:60'],
            'chart.mahadasha' => ['required_with:chart', 'string', 'max:20'],
            'chart.antardasha' => ['required_with:chart', 'string', 'max:20'],
            'chart.antardasha_until' => ['nullable', 'date'],
            'chart.birth_time_known' => ['nullable', 'boolean'],
            'chart.planets' => ['required_with:chart', 'array', 'max:9'],
            'chart.planets.*.name' => ['required', 'string', 'max:20'],
            'chart.planets.*.sign' => ['required', 'string', 'max:20'],
            'chart.planets.*.degree' => ['required', 'numeric', 'between:0,30'],
            'chart.planets.*.house' => ['required', 'integer', 'between:1,12'],
            'chart.planets.*.nakshatra' => ['required', 'string', 'max:30'],
            'chart.planets.*.retrograde' => ['required', 'boolean'],
            'chart.planets.*.dignity' => ['required', 'string', 'max:30'],
        ];
    }
}
