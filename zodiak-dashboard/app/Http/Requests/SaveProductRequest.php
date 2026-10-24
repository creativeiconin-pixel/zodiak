<?php

namespace App\Http\Requests;

use App\Models\Remedy;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class SaveProductRequest extends FormRequest
{
    /**
     * Shop categories a product can be listed under, keyed by stored value.
     *
     * @var array<string, string>
     */
    public const CATEGORIES = [
        'gemstones' => 'Gemstones',
        'rudraksha' => 'Rudraksha',
        'yantras' => 'Yantras',
        'kavach' => 'Kavach',
        'books' => 'Books',
    ];

    /**
     * Material Symbols icon names are lowercase words joined by underscores.
     */
    private const ICON = 'regex:/^[a-z0-9_]+$/';

    /**
     * Any signed-in Op-Center user may manage products; the routes are behind auth:web.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Fill in a unique slug from the name when none is given (or keep the current one when editing).
     */
    protected function prepareForValidation(): void
    {
        $slug = Str::slug((string) $this->input('slug'));

        if ($slug === '') {
            $slug = $this->product()?->slug ?? $this->uniqueSlugFor((string) $this->input('name'));
        }

        $this->merge(['slug' => $slug, 'is_active' => $this->boolean('is_active')]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $icon = ['nullable', 'string', 'max:64', self::ICON];

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'alpha_dash', Rule::unique('remedies', 'slug')->ignore($this->product())],
            'category' => ['required', Rule::in(array_keys(self::CATEGORIES))],
            'accent' => ['nullable', Rule::in(['primary', 'secondary'])],
            'tagline' => ['required', 'string', 'max:255'],
            'origin' => ['required', 'string', 'max:255'],
            'price' => ['required', 'integer', 'min:1', 'max:10000000'],
            'compare_at_price' => ['nullable', 'integer', 'gt:price', 'max:10000000'],
            'cost_price' => ['required', 'integer', 'min:0', 'max:10000000'],
            'stock' => ['nullable', 'integer', 'min:0', 'max:1000000'],
            'price_note' => ['required', 'string', 'max:255'],
            'price_detail' => ['nullable', 'string', 'max:255'],
            'specification' => ['required', 'string', 'max:255'],
            'planet_label' => ['required', 'string', 'max:255'],
            'planet_icon' => $icon,
            'badge_label' => ['nullable', 'string', 'max:255'],
            'badge_icon' => $icon,
            'benefits' => ['nullable', 'array', 'max:3'],
            'benefits.*.label' => ['nullable', 'string', 'max:255'],
            'benefits.*.icon' => $icon,
            'assurance_label' => ['required', 'string', 'max:255'],
            'assurance_icon' => $icon,
            'image' => [$this->product() ? 'nullable' : 'required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'image_alt' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:65535'],
            'is_active' => ['boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'compare_at_price' => 'MRP (crossed-out price)',
            'cost_price' => 'our cost',
            'planet_label' => 'planet text',
            'assurance_label' => 'assurance text',
            'benefits.*.label' => 'benefit text',
            'benefits.*.icon' => 'benefit icon',
        ];
    }

    /**
     * The validated input shaped as remedy columns. Translations and the image file are handled elsewhere.
     *
     * @return array<string, mixed>
     */
    public function productAttributes(): array
    {
        $item = fn (?string $label, ?string $icon, string $fallbackIcon): ?array => filled($label)
            ? ['icon' => filled($icon) ? $icon : $fallbackIcon, 'label' => $label]
            : null;

        return [
            'name' => $this->validated('name'),
            'slug' => $this->validated('slug'),
            'category' => $this->validated('category'),
            'accent' => $this->validated('accent') ?? 'primary',
            'tagline' => $this->validated('tagline'),
            'origin' => $this->validated('origin'),
            'price' => (int) $this->validated('price'),
            'compare_at_price' => $this->validated('compare_at_price'),
            'cost_price' => (int) $this->validated('cost_price'),
            'stock' => $this->validated('stock'),
            'price_note' => $this->validated('price_note'),
            'price_detail' => $this->validated('price_detail'),
            'specification' => $this->validated('specification'),
            'planet' => $item($this->validated('planet_label'), $this->validated('planet_icon'), 'explore'),
            'badge' => $item($this->validated('badge_label'), $this->validated('badge_icon'), 'stars'),
            'benefits' => collect($this->validated('benefits') ?? [])
                ->map(fn (array $benefit) => $item($benefit['label'] ?? null, $benefit['icon'] ?? null, 'check_circle'))
                ->filter()
                ->values()
                ->all(),
            'assurance' => $item($this->validated('assurance_label'), $this->validated('assurance_icon'), 'verified'),
            'image_alt' => $this->validated('image_alt') ?: $this->validated('name'),
            'sort_order' => (int) ($this->validated('sort_order') ?? 0),
            'is_active' => (bool) $this->validated('is_active'),
        ];
    }

    /**
     * The product being edited, or null when adding a new one.
     */
    private function product(): ?Remedy
    {
        $product = $this->route('product');

        return $product instanceof Remedy ? $product : null;
    }

    /**
     * A slug based on the name that no other product uses yet, e.g. "ruby-ring-2".
     */
    private function uniqueSlugFor(string $name): string
    {
        $base = Str::slug($name) ?: 'product';
        $slug = $base;

        for ($suffix = 2; Remedy::where('slug', $slug)->exists(); $suffix++) {
            $slug = "{$base}-{$suffix}";
        }

        return $slug;
    }
}
