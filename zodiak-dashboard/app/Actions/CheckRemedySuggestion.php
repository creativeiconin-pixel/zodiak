<?php

namespace App\Actions;

use App\Models\Remedy;
use App\Models\Seeker;

/**
 * Checks a product Pandit Jii suggested against the knowledge base and the person's chart. Any problem found means a
 * human Pandit must approve the suggestion before the seeker can buy it from the chat.
 */
class CheckRemedySuggestion
{
    /**
     * Problems with the suggestion, in plain English for the Pandit team. An empty list means it matches the knowledge base.
     *
     * @param  array<string, mixed>|null  $chart
     * @return list<string>
     */
    public function problems(Remedy $remedy, ?array $chart, Seeker $seeker): array
    {
        $remedy->loadMissing('knowledge');
        $knowledge = $remedy->knowledge;
        $problems = [];

        if (! $remedy->is_active) {
            $problems[] = 'This product is hidden from the shop.';
        }

        if ($remedy->stock !== null && $remedy->stock <= 0) {
            $problems[] = 'This product is out of stock.';
        }

        if ($seeker->orders()->where('remedy_id', $remedy->id)->exists()) {
            $problems[] = 'The seeker has already ordered this product.';
        }

        if ($knowledge === null || $knowledge->completeness() === 0) {
            $problems[] = 'The knowledge base has no guidance for this product yet.';

            return $problems;
        }

        $risingSign = DescribeStoreForPandit::risingSign($chart);

        if ($knowledge->avoidsSign($risingSign)) {
            $problems[] = "The knowledge base says to avoid this product for {$risingSign} rising.";
        } elseif (filled($knowledge->good_signs)) {
            $problems[] = match (true) {
                $chart === null => 'No birth chart, but this product only suits some rising signs ('.implode(', ', $knowledge->good_signs).').',
                $risingSign === null => 'Birth time unknown, so the rising sign is not sure. This product only suits some rising signs ('.implode(', ', $knowledge->good_signs).').',
                in_array($risingSign, $knowledge->good_signs, true) => null,
                default => "{$risingSign} rising is not in this product's good signs (".implode(', ', $knowledge->good_signs).').',
            };
        }

        return array_values(array_filter($problems));
    }
}
