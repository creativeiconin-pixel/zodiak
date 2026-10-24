<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\RechargeStatus;
use App\Models\ChatMessage;
use App\Models\CreditRecharge;
use App\Models\Order;
use App\Models\PalmReading;
use App\Models\Seeker;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\View\View;

class OverviewController extends Controller
{
    /**
     * Business days are counted in Indian time.
     */
    private const TIMEZONE = 'Asia/Kolkata';

    /**
     * Period filter options, keyed by the ?period= value.
     *
     * @var array<string, string>
     */
    private const PERIODS = ['today' => 'Today', '7d' => '7 days', '30d' => '30 days', 'all' => 'All time'];

    /**
     * Number of days shown in the revenue & profit chart.
     */
    private const CHART_DAYS = 30;

    /**
     * Business overview: revenue, cost, profit, orders, payments and users.
     */
    public function __invoke(Request $request): View
    {
        $period = array_key_exists((string) $request->query('period'), self::PERIODS) ? (string) $request->query('period') : '30d';
        $from = $this->periodStart($period);
        $inPeriod = fn (Builder $query) => $query->when($from, fn (Builder $query) => $query->where('created_at', '>=', $from));

        $money = Order::paid()->tap($inPeriod)
            ->selectRaw('count(*) as paid_orders, coalesce(sum(amount), 0) as revenue, coalesce(sum(cost_amount), 0) as cost')
            ->toBase()
            ->first();
        $orderRevenue = (int) $money->revenue;
        $cost = (int) $money->cost;
        // Credit packs have no product cost, so all of it counts as profit
        $credits = CreditRecharge::where('status', RechargeStatus::Credited)
            ->when($from, fn ($query) => $query->where('payment_verified_at', '>=', $from))
            ->selectRaw('count(*) as recharges, coalesce(sum(amount), 0) as amount')
            ->toBase()
            ->first();
        $revenue = $orderRevenue + (int) $credits->amount;

        $statusCounts = Order::query()->tap($inPeriod)
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $refunds = Order::where('payment_status', PaymentStatus::RefundPending)
            ->selectRaw('count(*) as orders, coalesce(sum(amount), 0) as amount')
            ->toBase()
            ->first();

        return view('overview', [
            'period' => $period,
            'periods' => self::PERIODS,
            'kpis' => [
                'revenue' => $revenue,
                'order_revenue' => $orderRevenue,
                'credit_sales' => (int) $credits->amount,
                'credit_recharges' => (int) $credits->recharges,
                'cost' => $cost,
                'profit' => $revenue - $cost,
                'margin' => $revenue > 0 ? round(($revenue - $cost) / $revenue * 100, 1) : null,
                'orders' => (int) $statusCounts->sum(),
                'paid_orders' => (int) $money->paid_orders,
                'payments_waiting' => Order::where('payment_status', PaymentStatus::VerificationPending)->count()
                    + CreditRecharge::where('status', RechargeStatus::VerificationPending)->count(),
                'refunds_pending' => (int) $refunds->amount,
                'refunds_pending_orders' => (int) $refunds->orders,
                'users' => Seeker::count(),
                'users_this_week' => Seeker::where('created_at', '>=', now()->subWeek())->count(),
                'questions' => ChatMessage::where('role', 'user')->count(),
                'palm_readings' => PalmReading::count(),
            ],
            'statuses' => collect(OrderStatus::cases())->map(fn (OrderStatus $status) => [
                'status' => $status,
                'count' => (int) ($statusCounts[$status->value] ?? 0),
            ]),
            'chart' => $this->dailyChart(),
            'topProducts' => Order::paid()->tap($inPeriod)
                ->selectRaw('remedy_id, count(*) as units, sum(amount) as revenue, sum(cost_amount) as cost')
                ->groupBy('remedy_id')
                ->orderByDesc('revenue')
                ->limit(8)
                ->with('remedy:id,slug,name,image,category')
                ->get(),
            'latestOrders' => Order::with('remedy:id,slug,name,image')->latest()->limit(5)->get(),
        ]);
    }

    /**
     * When the selected period begins, in the app's timezone (null for all time).
     */
    private function periodStart(string $period): ?CarbonImmutable
    {
        $today = CarbonImmutable::now(self::TIMEZONE)->startOfDay();

        $start = match ($period) {
            'today' => $today,
            '7d' => $today->subDays(6),
            '30d' => $today->subDays(29),
            default => null,
        };

        return $start?->setTimezone(config('app.timezone'));
    }

    /**
     * Revenue, cost and profit per day for the chart, oldest day first.
     *
     * Paid orders are fetched with only the needed columns and grouped by Indian date in PHP,
     * which works the same on SQLite and MySQL.
     *
     * @return list<array{date: CarbonImmutable, revenue: int, cost: int, profit: int, orders: int}>
     */
    private function dailyChart(): array
    {
        $firstDay = CarbonImmutable::now(self::TIMEZONE)->startOfDay()->subDays(self::CHART_DAYS - 1);

        $byDay = Order::paid()
            ->where('created_at', '>=', $firstDay->setTimezone(config('app.timezone')))
            ->get(['amount', 'cost_amount', 'created_at'])
            ->groupBy(fn (Order $order) => $order->created_at->timezone(self::TIMEZONE)->toDateString());

        return collect(range(0, self::CHART_DAYS - 1))->map(function (int $offset) use ($firstDay, $byDay) {
            $date = $firstDay->addDays($offset);
            $orders = $byDay->get($date->toDateString(), collect());
            $revenue = (int) $orders->sum('amount');
            $cost = (int) $orders->sum('cost_amount');

            return ['date' => $date, 'revenue' => $revenue, 'cost' => $cost, 'profit' => $revenue - $cost, 'orders' => $orders->count()];
        })->all();
    }
}
