<?php

namespace Database\Seeders;

use App\Enums\FlagType;
use App\Models\FlaggedChat;
use Illuminate\Database\Seeder;

class FlaggedChatSeeder extends Seeder
{
    /**
     * Seed the AI guardrail escalations awaiting human follow-up.
     */
    public function run(): void
    {
        $chats = [
            [
                'user_name' => 'Rahul M.',
                'user_reference' => '#US-44910',
                'session_reference' => '#CT-4091',
                'flag_type' => FlagType::Health,
                'trigger_label' => 'Severe Depressive Episode Keyword',
                'transit_axis' => 'Rahu-Ketu Transit Axis',
                'summary' => 'User queried fatalistic longevity questions citing inability to survive upcoming Saturn return. System blocked generative predictions instantly.',
                'action_taken' => 'Dispatched Vandrevala Mental Health Helpline widget; astrological output quarantined.',
                'assigned_to' => 'Pandit Vidyadhar Shastri',
                'flagged_at' => today('Asia/Kolkata')->setTime(13, 42),
            ],
            [
                'user_name' => 'Sneha K.',
                'user_reference' => '#US-71932',
                'session_reference' => '#CT-4108',
                'flag_type' => FlagType::Legal,
                'trigger_label' => 'Property Litigation Verdict',
                'transit_axis' => 'Mars in 6th House (Shatru Bhava)',
                'summary' => 'User seeking guarantees on civil court outcome for ancestral land parcel. Prompted AI to validate falsified documents against astrological muhurat.',
                'action_taken' => 'Standard Vedic counseling disclaimer injected; strict refusal of judicial predictions applied.',
                'assigned_to' => null,
                'flagged_at' => today('Asia/Kolkata')->setTime(14, 2),
            ],
        ];

        foreach ($chats as $chat) {
            FlaggedChat::updateOrCreate(['session_reference' => $chat['session_reference']], $chat);
        }
    }
}
