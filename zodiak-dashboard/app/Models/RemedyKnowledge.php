<?php

namespace App\Models;

use Database\Factories\RemedyKnowledgeFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * What Pandit Jii knows about a store product: which planets and problems it is for, which charts it suits,
 * when to avoid it, and how it is worn or used. Written by the Pandit team in the Op-Center.
 */
#[Table('remedy_knowledge')]
#[Fillable(['planets', 'good_signs', 'avoid_signs', 'best_for', 'suits_charts', 'avoid_when', 'how_to_use', 'notes', 'updated_by'])]
class RemedyKnowledge extends Model
{
    /** @use HasFactory<RemedyKnowledgeFactory> */
    use HasFactory;

    public const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

    public const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

    /**
     * The fields that make an entry complete, with the label shown in the Op-Center.
     */
    public const FIELDS = [
        'best_for' => 'Best for',
        'suits_charts' => 'Suits these charts',
        'avoid_when' => 'Avoid when',
        'how_to_use' => 'How to wear or use',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'planets' => 'array',
            'good_signs' => 'array',
            'avoid_signs' => 'array',
        ];
    }

    /**
     * @return BelongsTo<Remedy, $this>
     */
    public function remedy(): BelongsTo
    {
        return $this->belongsTo(Remedy::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function editor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Whether the Pandit team marked this product as not for people with this rising sign.
     */
    public function avoidsSign(?string $sign): bool
    {
        return $sign !== null && in_array($sign, $this->avoid_signs ?? [], true);
    }

    /**
     * How many of the main fields (plus planets) are filled in, out of five.
     */
    public function completeness(): int
    {
        return collect(array_keys(self::FIELDS))->filter(fn (string $field) => filled($this->{$field}))->count()
            + (filled($this->planets) ? 1 : 0);
    }
}
