<?php

namespace App\Http\Requests;

use App\Models\RemedyKnowledge;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateRemedyKnowledgeRequest extends FormRequest
{
    /**
     * Any signed-in Op-Center user may edit the knowledge base; the routes are behind auth:web.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'planets' => ['nullable', 'array'],
            'planets.*' => [Rule::in(RemedyKnowledge::PLANETS)],
            'good_signs' => ['nullable', 'array'],
            'good_signs.*' => [Rule::in(RemedyKnowledge::SIGNS)],
            'avoid_signs' => ['nullable', 'array'],
            'avoid_signs.*' => [Rule::in(RemedyKnowledge::SIGNS)],
            'best_for' => ['nullable', 'string', 'max:1500'],
            'suits_charts' => ['nullable', 'string', 'max:1500'],
            'avoid_when' => ['nullable', 'string', 'max:1500'],
            'how_to_use' => ['nullable', 'string', 'max:1500'],
            'notes' => ['nullable', 'string', 'max:1500'],
        ];
    }

    /**
     * A rising sign can't be both a good fit and one to avoid.
     *
     * @return array<int, callable>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $both = array_intersect((array) $this->input('good_signs', []), (array) $this->input('avoid_signs', []));

                if ($both !== []) {
                    $validator->errors()->add('avoid_signs', 'A sign cannot be in both lists: '.implode(', ', $both).'.');
                }
            },
        ];
    }
}
