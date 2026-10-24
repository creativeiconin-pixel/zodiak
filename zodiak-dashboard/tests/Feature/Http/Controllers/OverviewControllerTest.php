<?php

namespace Tests\Feature\Http\Controllers;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\ChatMessage;
use App\Models\Order;
use App\Models\PalmReading;
use App\Models\Remedy;
use App\Models\Seeker;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Collection;
use Tests\TestCase;

class OverviewControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login(): void
    {
        $this->get(route('overview'))->assertRedirect(route('login'));
    }

    public function test_money_counts_only_paid_orders_and_skips_refunds(): void
    {
        $this->paidOrder(10000, 6000, PaymentStatus::EscrowHeld);
        $this->paidOrder(5000, 2000, PaymentStatus::Captured);
        $this->paidOrder(1000, 500, PaymentStatus::RefundPending);
        $this->paidOrder(7000, 3000, PaymentStatus::Refunded);
        $this->paidOrder(2000, 1000, PaymentStatus::VerificationPending);
        $this->paidOrder(4000, 1000, PaymentStatus::AwaitingPayment);

        $this->actingAs(User::factory()->create())
            ->get(route('overview'))
            ->assertOk()
            ->assertViewHas('kpis', fn (array $kpis) => $kpis['revenue'] === 16000
                && $kpis['cost'] === 8500
                && $kpis['profit'] === 7500
                && $kpis['margin'] === 46.9
                && $kpis['orders'] === 6
                && $kpis['paid_orders'] === 3
                && $kpis['payments_waiting'] === 1
                && $kpis['refunds_pending'] === 1000)
            ->assertSee('₹16,000')
            ->assertSee('₹7,500')
            ->assertSee('46.9% margin');
    }

    public function test_period_filter_limits_money_to_the_chosen_range(): void
    {
        $this->paidOrder(3000, 1000, PaymentStatus::Captured, ['created_at' => now()->subDays(12)]);
        $this->paidOrder(800, 300, PaymentStatus::Captured, ['created_at' => now()->subDays(3)]);
        $this->paidOrder(200, 100, PaymentStatus::Captured, ['created_at' => now()->subDays(60)]);
        $user = User::factory()->create();

        $revenueFor = fn (string $period): int => $this->actingAs($user)->get(route('overview', ['period' => $period]))->viewData('kpis')['revenue'];

        $this->assertSame(800, $revenueFor('7d'));
        $this->assertSame(3800, $revenueFor('30d'));
        $this->assertSame(4000, $revenueFor('all'));
        $this->assertSame(0, $revenueFor('today'));
        $this->assertSame(3800, $revenueFor('nonsense'));
    }

    public function test_chart_top_products_and_activity_counts(): void
    {
        $ruby = Remedy::factory()->create(['name' => 'Ruby Ring']);
        $this->paidOrder(5000, 2000, PaymentStatus::Captured, ['remedy_id' => $ruby->id]);
        $this->paidOrder(5000, 2000, PaymentStatus::Captured, ['remedy_id' => $ruby->id, 'created_at' => now()->subDays(2)]);
        $this->paidOrder(900, 400, PaymentStatus::EscrowHeld);
        Seeker::factory()->create(['created_at' => now()->subMonth()]);
        ChatMessage::factory()->count(2)->create();
        ChatMessage::factory()->create(['role' => 'assistant']);
        PalmReading::factory()->create();

        $response = $this->actingAs(User::factory()->create())->get(route('overview'))->assertOk();

        $chart = collect($response->viewData('chart'));
        $this->assertCount(30, $chart);
        $this->assertSame(10900, $chart->sum('revenue'));
        $this->assertSame(5900, $chart->last()['revenue']);
        $this->assertSame(3500, $chart->last()['profit']);

        $top = $response->viewData('topProducts')->first();
        $this->assertSame('Ruby Ring', $top->remedy->name);
        $this->assertSame(2, (int) $top->units);
        $this->assertSame(10000, (int) $top->revenue);

        $kpis = $response->viewData('kpis');
        $this->assertSame(5, $kpis['users']);
        $this->assertSame(4, $kpis['users_this_week']);
        $this->assertSame(2, $kpis['questions']);
        $this->assertSame(1, $kpis['palm_readings']);

        /** @var Collection<int, array{status: OrderStatus, count: int}> $statuses */
        $statuses = $response->viewData('statuses');
        $this->assertSame(3, $statuses->firstWhere('status', OrderStatus::AwaitingApproval)['count']);

        $response->assertSee('Ruby Ring')->assertSee(route('orders.show', Order::latest('id')->first()));
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function paidOrder(int $amount, int $cost, PaymentStatus $paymentStatus, array $attributes = []): Order
    {
        return Order::factory()->create([
            'amount' => $amount,
            'cost_amount' => $cost,
            'payment_status' => $paymentStatus,
            ...$attributes,
        ]);
    }

    public function test_banner_points_to_utrs_waiting_for_a_check(): void
    {
        Order::factory()->utrSubmitted('412356789012')->create();

        $this->actingAs(User::factory()->create())
            ->get(route('overview'))
            ->assertOk()
            ->assertSee('1 UPI payment waiting for your check')
            ->assertSee('UTR 412356789012')
            ->assertSee(route('payments.index'), escape: false);
    }

    public function test_no_banner_when_nothing_waits_for_a_check(): void
    {
        Order::factory()->create();

        $this->actingAs(User::factory()->create())
            ->get(route('overview'))
            ->assertOk()
            ->assertDontSee('waiting for your check');
    }
}
