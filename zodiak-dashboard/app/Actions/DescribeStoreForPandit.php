<?php

namespace App\Actions;

use App\Models\Remedy;
use App\Models\RemedyKnowledge;
use Illuminate\Support\Collection;
use Illuminate\Support\Number;

/**
 * Turns the store and its knowledge base into the product guide Pandit Jii reads before answering,
 * so a suggestion always matches the person's question and chart.
 */
class DescribeStoreForPandit
{
    /**
     * Products Pandit Jii may suggest: shown in the app, not out of stock, and not marked "avoid" for the
     * person's rising sign. Leaving avoided products out entirely means the AI can never pick them.
     *
     * @return Collection<int, Remedy>
     */
    public function suggestable(?string $risingSign = null): Collection
    {
        return Remedy::active()
            ->where(fn ($query) => $query->whereNull('stock')->orWhere('stock', '>', 0))
            ->with('knowledge')
            ->orderBy('sort_order')
            ->get()
            ->reject(fn (Remedy $remedy) => (bool) $remedy->knowledge?->avoidsSign($risingSign))
            ->values();
    }

    /**
     * The full product guide, one block per product, matched to the person's rising sign when it is known.
     */
    public function guide(?string $risingSign = null): string
    {
        $blocks = $this->suggestable($risingSign)->map(fn (Remedy $remedy) => $this->describe($remedy, $risingSign));

        return $blocks->isEmpty() ? 'No shop product suits this person right now; do not suggest any.' : $blocks->implode("\n\n");
    }

    /**
     * The rising sign to match products to. Only a known birth time gives a reliable one.
     *
     * @param  array<string, mixed>|null  $chart
     */
    public static function risingSign(?array $chart): ?string
    {
        return $chart !== null && ($chart['birth_time_known'] ?? true) ? self::signOf($chart['ascendant'] ?? null) : null;
    }

    /**
     * The English sign name at the start of a chart ascendant such as "Taurus 10°00'".
     */
    public static function signOf(?string $ascendant): ?string
    {
        $sign = ucfirst(strtolower((string) strtok((string) $ascendant, ' ')));

        return in_array($sign, RemedyKnowledge::SIGNS, true) ? $sign : null;
    }

    /**
     * What Pandit Jii should know about one product.
     */
    public function describe(Remedy $remedy, ?string $risingSign = null): string
    {
        $knowledge = $remedy->knowledge;
        $benefits = collect($remedy->benefits ?? [])->pluck('label')->filter()->implode(', ');

        $lines = [
            "[{$remedy->slug}] {$remedy->name} — {$remedy->category}, ".Number::currency($remedy->price, 'INR', 'en_IN', 0).'. Planet: '.($remedy->planet['label'] ?? 'none').'.',
            "  Shop text: {$remedy->tagline}. {$remedy->specification}.".($benefits !== '' ? " Benefits: {$benefits}." : ''),
        ];

        if ($knowledge === null || $knowledge->completeness() === 0) {
            $lines[] = '  The Pandit team has not written guidance for this product yet. Only suggest it if the question clearly asks for exactly this item.';

            return implode("\n", $lines);
        }

        if (filled($knowledge->planets)) {
            $lines[] = '  Planets: '.implode(', ', $knowledge->planets).'.';
        }

        if (filled($knowledge->good_signs)) {
            $lines[] = '  Good for rising signs: '.implode(', ', $knowledge->good_signs).'.';
        }

        if ($risingSign !== null) {
            $lines[] = match (true) {
                in_array($risingSign, $knowledge->good_signs ?? [], true) => "  Fit for this person: GOOD — suits their {$risingSign} rising sign.",
                filled($knowledge->good_signs) => "  Fit for this person: not a usual match for {$risingSign} rising. Only suggest it with a strong chart reason, and say a Pandit must check first.",
                default => '  Fit for this person: suits every rising sign.',
            };
        }

        foreach ([...RemedyKnowledge::FIELDS, 'notes' => 'Pandit team notes'] as $field => $label) {
            if (filled($knowledge->{$field})) {
                $lines[] = "  {$label}: ".trim($knowledge->{$field});
            }
        }

        return implode("\n", $lines);
    }
}
