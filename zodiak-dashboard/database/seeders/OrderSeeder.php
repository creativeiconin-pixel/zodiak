<?php

namespace Database\Seeders;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Remedy;
use App\Models\Seeker;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Seed the approval queue shown on the pandit dashboard.
     */
    public function run(): void
    {
        $remedyIds = Remedy::pluck('id', 'slug');
        $demoSeekerId = Seeker::where('email', 'ananya@zodiak.test')->value('id');

        $orders = [
            [
                'reference' => 'ZK-89241',
                'remedy_id' => $remedyIds['ceylon-yellow-sapphire-ring'],
                'seeker_id' => $demoSeekerId,
                'customer_name' => 'Ananya Sharma',
                'customer_phone' => '+91 98765 43210',
                'address_line' => 'Flat 402, Celestial Heights, 12th Main',
                'city_postal' => 'Indiranagar, Bengaluru, Karnataka - 560038',
                'lagna' => 'Libra Lagna',
                'nakshatra' => 'Swati Nakshatra (Pada 3)',
                'gotra' => 'Kashyapa',
                'amount' => 14999,
                'specification' => '4.25 Ratti',
                'ai_rationale_title' => 'Rahu Antardasha:',
                'ai_rationale' => '12th house transit creating career stagnation; benefic Jupiter 9th aspect requires direct strengthening.',
                'chart_compatibility' => 94,
                'is_high_risk' => false,
                'muhurat' => 'Guru Pushya Nakshatra (Oct 28)',
            ],
            [
                'reference' => 'ZK-89255',
                'remedy_id' => $remedyIds['kashmir-blue-sapphire-neelam'],
                'customer_name' => 'Vikramaditya Roy',
                'customer_phone' => '+91 99887 76655',
                'address_line' => '14 Marine Drive',
                'city_postal' => 'Mumbai, Maharashtra - 400020',
                'lagna' => 'Taurus Lagna',
                'nakshatra' => 'Pushya Nakshatra (Pada 1)',
                'amount' => 28000,
                'specification' => '5.10 Ratti',
                'ai_rationale_title' => 'Caution:',
                'ai_rationale' => 'Saturn in 8th house aspecting Lagna. Mandatory 3-day Amethyst pillow trial test recommended before setting.',
                'chart_compatibility' => 68,
                'is_high_risk' => true,
                'muhurat' => 'Shani Pushya (Nov 02)',
            ],
            [
                'reference' => 'ZK-89280',
                'remedy_id' => $remedyIds['italian-red-coral-moonga'],
                'customer_name' => 'Priya Iyer',
                'customer_phone' => '+91 90031 22110',
                'address_line' => '7 Cathedral Road',
                'city_postal' => 'Chennai, Tamil Nadu - 600086',
                'lagna' => 'Aries Lagna',
                'nakshatra' => 'Rohini Nakshatra (Pada 4)',
                'amount' => 7500,
                'specification' => '6.50 Ratti',
                'ai_rationale_title' => 'Mangal Dosha Neutralization:',
                'ai_rationale' => 'Mars placed in 7th house causing marital discord. High vitality copper ring prescribed.',
                'chart_compatibility' => 98,
                'is_high_risk' => false,
                'muhurat' => 'Mangal Hora (Oct 29)',
            ],
        ];

        foreach ($orders as $order) {
            Order::updateOrCreate(['reference' => $order['reference']], [
                ...$order,
                'status' => OrderStatus::AwaitingApproval,
                'payment_status' => PaymentStatus::EscrowHeld,
                'payment_reference' => 'PL-'.substr($order['reference'], 3).'0001',
            ]);
        }
    }
}
