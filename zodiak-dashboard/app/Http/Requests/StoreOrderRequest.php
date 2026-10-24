<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrderRequest extends FormRequest
{
    /**
     * Checkout is open to guests; the order reference acts as the tracking token.
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
            'remedy' => ['required', 'string', Rule::exists('remedies', 'slug')->where('is_active', true)],
            'customer_name' => ['required', 'string', 'max:120'],
            'customer_phone' => ['required', 'string', 'regex:/^\+?[0-9 ]{10,16}$/'],
            'address_line' => ['required', 'string', 'max:255'],
            'city_postal' => ['required', 'string', 'max:255'],
            'lagna' => ['nullable', 'string', 'max:60'],
            'nakshatra' => ['nullable', 'string', 'max:60'],
            'gotra' => ['nullable', 'string', 'max:60'],
        ];
    }
}
