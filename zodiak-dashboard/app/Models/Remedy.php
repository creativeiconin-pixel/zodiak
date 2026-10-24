<?php

namespace App\Models;

use Database\Factories\RemedyFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable([
    'slug', 'name', 'category', 'tagline', 'origin', 'image', 'image_alt', 'accent', 'badge', 'planet',
    'benefits', 'assurance', 'price', 'compare_at_price', 'cost_price', 'price_detail', 'price_note', 'specification', 'translations', 'sort_order', 'is_active', 'stock',
])]
class Remedy extends Model
{
    /** @use HasFactory<RemedyFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'badge' => 'array',
            'planet' => 'array',
            'benefits' => 'array',
            'assurance' => 'array',
            'translations' => 'array',
            'price' => 'integer',
            'compare_at_price' => 'integer',
            'cost_price' => 'integer',
            'is_active' => 'boolean',
            'stock' => 'integer',
        ];
    }

    /**
     * A copy of the remedy's display text in the given locale, falling back to English for anything untranslated.
     *
     * @return array{name: string, tagline: string, origin: string, badge: array<string, string>|null, planet: array<string, string>, benefits: list<array<string, string>>, assurance: array<string, string>, price_detail: string|null, price_note: string, specification: string}
     */
    public function localized(string $locale): array
    {
        $translation = $this->translations[$locale] ?? [];
        $label = fn (?array $item, ?string $translated) => $item === null ? null : [...$item, 'label' => $translated ?? $item['label']];

        return [
            'name' => $translation['name'] ?? $this->name,
            'tagline' => $translation['tagline'] ?? $this->tagline,
            'origin' => $translation['origin'] ?? $this->origin,
            'badge' => $label($this->badge, $translation['badge'] ?? null),
            'planet' => $label($this->planet, $translation['planet'] ?? null),
            'benefits' => collect($this->benefits)->map(fn (array $benefit, int $index) => $label($benefit, $translation['benefits'][$index] ?? null))->all(),
            'assurance' => $label($this->assurance, $translation['assurance'] ?? null),
            'price_detail' => $translation['price_detail'] ?? $this->price_detail,
            'price_note' => $translation['price_note'] ?? $this->price_note,
            'specification' => $translation['specification'] ?? $this->specification,
        ];
    }

    /**
     * Only products switched on in the admin panel appear in the app.
     */
    #[Scope]
    protected function active(Builder $query): void
    {
        $query->where('is_active', true);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * What Pandit Jii knows about this product, for suggesting it in answers.
     *
     * @return HasOne<RemedyKnowledge, $this>
     */
    public function knowledge(): HasOne
    {
        return $this->hasOne(RemedyKnowledge::class);
    }

    /**
     * @return HasMany<Order, $this>
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}
