<?php

namespace App\Mcp\Tools;

use App\Enums\PaymentStatus;
use App\Models\ChatMessage;
use App\Models\Order;
use App\Models\PalmReading;
use App\Models\Seeker;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\JsonSchema\Types\Type;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[IsReadOnly]
#[Description('Revenue, cost, profit, order counts, payments waiting for a UTR check, refunds and user numbers for a period.')]
class BusinessSummaryTool extends Tool
{
    /**
     * Handle the tool request.
     */
    public function handle(Request $request): Response
    {
        $validated = $request->validate(['days' => ['nullable', 'integer', 'min:1', 'max:3650']]);
        $days = $validated['days'] ?? 30;
        $inPeriod = fn (Builder $query) => $query->where('created_at', '>=', now()->subDays($days));

        $money = Order::paid()->tap($inPeriod)
            ->selectRaw('count(*) as paid_orders, coalesce(sum(amount), 0) as revenue, coalesce(sum(cost_amount), 0) as cost')
            ->toBase()
            ->first();
        $revenue = (int) $money->revenue;
        $cost = (int) $money->cost;

        return Response::json([
            'period_days' => $days,
            'currency' => 'INR',
            'revenue' => $revenue,
            'cost' => $cost,
            'profit' => $revenue - $cost,
            'margin_percent' => $revenue > 0 ? round(($revenue - $cost) / $revenue * 100, 1) : null,
            'orders' => Order::query()->tap($inPeriod)->count(),
            'paid_orders' => (int) $money->paid_orders,
            'orders_by_status' => Order::query()->tap($inPeriod)->selectRaw('status, count(*) as total')->groupBy('status')->pluck('total', 'status'),
            'payments_waiting_for_check' => Order::where('payment_status', PaymentStatus::VerificationPending)->count(),
            'refunds_pending_amount' => (int) Order::where('payment_status', PaymentStatus::RefundPending)->sum('amount'),
            'users_total' => Seeker::count(),
            'new_users' => Seeker::query()->tap($inPeriod)->count(),
            'pandit_jii_questions' => ChatMessage::where('role', 'user')->tap($inPeriod)->count(),
            'palm_readings' => PalmReading::query()->tap($inPeriod)->count(),
        ]);
    }

    /**
     * Get the tool's input schema.
     *
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'days' => $schema->integer()->description('How many past days to include. Default 30.'),
        ];
    }
}
