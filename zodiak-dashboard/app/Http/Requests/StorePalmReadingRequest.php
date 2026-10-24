<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePalmReadingRequest extends FormRequest
{
    /**
     * The route is behind auth:sanctum; any signed-in seeker may have their palm read.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * The app usually shrinks photos to JPEG before upload; HEIC straight from an iPhone is converted on the server.
     * "chart_summary" is an optional one-paragraph English summary of the seeker's birth chart.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'image' => ['required', 'file', 'mimetypes:image/jpeg,image/png,image/webp,image/heic,image/heif', 'max:8192'],
            'hand' => ['required', Rule::in(['left', 'right'])],
            'chart_summary' => ['nullable', 'string', 'max:600'],
        ];
    }
}
