<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\AuditLog;
use App\Models\ChatMessage;
use App\Models\FlaggedChat;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\View\View;

class DashboardController extends Controller
{
    /**
     * Planet labels used by the approval queue's filter tabs.
     *
     * @var array<string, list<string>>
     */
    private const PLANET_FILTERS = [
        'saturnian' => ['Saturn'],
        'solar-jovian' => ['Jupiter', 'Sun'],
    ];

    public function __invoke(Request $request): View
    {
        $search = trim((string) $request->query('q', ''));
        $planetFilter = $request->query('planet');

        $reviewQueue = Order::awaitingReview()->with('remedy')->oldest()->get();

        $filteredQueue = $reviewQueue
            ->when(isset(self::PLANET_FILTERS[$planetFilter]), fn ($orders) => $orders->filter(
                fn (Order $order) => Str::contains($order->remedy->planet['label'], self::PLANET_FILTERS[$planetFilter])
            ))
            ->when($search !== '', fn ($orders) => $orders->filter(
                fn (Order $order) => Str::contains("{$order->reference} {$order->customer_name}", ltrim($search, '#'), ignoreCase: true)
            ));

        $refundClaims = Order::where('payment_status', PaymentStatus::RefundPending);

        return view('dashboard', [
            'search' => $search,
            'planetFilter' => $planetFilter,
            'reviewQueue' => $filteredQueue,
            'reviewQueueCount' => $reviewQueue->count(),
            'highUrgencyCount' => $reviewQueue->filter(fn (Order $order) => $order->is_high_risk || $order->amount >= 10000)->count(),
            'fulfilmentQueue' => Order::inFulfilment()->with('remedy')->oldest('reviewed_at')->get(),
            'pipelineCount' => Order::where('status', OrderStatus::Approved)->count(),
            'flaggedChats' => FlaggedChat::open()->latest('flagged_at')->get(),
            'suggestionReviews' => ChatMessage::awaitingReview()->with(['seeker', 'remedy.knowledge'])->oldest('id')->get(),
            'refundClaimCount' => (clone $refundClaims)->count(),
            'refundClaimTotal' => (clone $refundClaims)->sum('amount'),
            'auditLogs' => AuditLog::latest('id')->paginate(6)->withQueryString(),
            'latestAuditLogId' => AuditLog::max('id') ?? 0,
        ]);
    }
}
