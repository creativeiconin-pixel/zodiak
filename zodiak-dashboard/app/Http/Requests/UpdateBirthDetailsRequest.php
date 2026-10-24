<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBirthDetailsRequest extends FormRequest
{
    /**
     * The route is behind auth:sanctum, so any signed-in seeker may update their own details.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'gender' => ['nullable', Rule::in(['female', 'male', 'other'])],
            'birth.date' => ['required', 'date_format:Y-m-d', 'before_or_equal:today', 'after:1900-01-01'],
            'birth.time_unknown' => ['required', 'boolean'],
            'birth.time' => ['exclude_if:birth.time_unknown,true', 'required', 'date_format:H:i'],
            'birth.place' => ['required', 'string', 'max:255'],
            'birth.latitude' => ['required', 'numeric', 'between:-90,90'],
            'birth.longitude' => ['required', 'numeric', 'between:-180,180'],
            'birth.timezone' => ['required', 'timezone:all'],
            'chart' => ['required', 'array:lagna,moon_sign,sun_sign,nakshatra,mahadasha,antardasha'],
            'chart.*' => ['required', 'string', 'max:60'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'birth.time.required' => __('Enter your birth time, or tick "I do not know my exact birth time".'),
            'birth.latitude.required' => __('Choose your birthplace from the suggestions so we can fix its coordinates.'),
        ];
    }
}
