<?php

namespace App\Http\Controllers;

use App\Actions\RecordAuditLog;
use App\Enums\ActorType;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\AuditLog;
use App\Models\Order;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Number;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class AdminOrderController extends Controller
{
    /**
     * Every order with filters for order status, payment status and a search box.
     */
    public function index(Request $request): View
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', Rule::enum(OrderStatus::class)],
            'payment' => ['nullable', Rule::enum(PaymentStatus::class)],
        ]);
        $search = trim($filters['q'] ?? '');

        $orders = Order::query()
            ->with('remedy')
            ->when($search !== '', fn (Builder $query) => $query->where(fn (Builder $inner) => $inner
                ->where('reference', 'like', '%'.ltrim($search, '#').'%')
                ->orWhere('customer_name', 'like', "%{$search}%")
                ->orWhere('customer_phone', 'like', "%{$search}%")
                ->orWhere('payment_utr', 'like', "%{$search}%")))
            ->when($filters['status'] ?? null, fn (Builder $query, string $status) => $query->where('status', $status))
            ->when($filters['payment'] ?? null, fn (Builder $query, string $payment) => $query->where('payment_status', $payment))
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return view('orders.index', [
            'orders' => $orders,
            'filters' => ['q' => $search, 'status' => $filters['status'] ?? null, 'payment' => $filters['payment'] ?? null],
            'statusCounts' => Order::query()->selectRaw('status, count(*) as total')->groupBy('status')->pluck('total', 'status'),
        ]);
    }

    /**
     * One order with customer, delivery, payment and its full audit history.
     */
    public function show(Order $order): View
    {
        $order->load(['remedy', 'seeker', 'reviewer', 'paymentVerifier']);

        return view('orders.show', [
            'order' => $order,
            'history' => AuditLog::where('reference_token', "#{$order->reference}")->oldest('id')->get(),
        ]);
    }

    /**
     * Delete an order and its payment record (e.g. a test or duplicate). Orders with real money held are kept.
     */
    public function destroy(Request $request, Order $order, RecordAuditLog $recordAuditLog): RedirectResponse
    {
        if (! $order->canBeDeleted()) {
            return back()->withErrors(['delete' => "#{$order->reference} has a verified payment. Refund it first, then you can delete it."]);
        }

        $amount = Number::currency($order->amount, 'INR', 'en_IN', 0);
        $order->delete();

        $recordAuditLog->handle(
            $request->user()->name,
            ActorType::Pandit,
            'Order Payment Deleted',
            "#{$order->reference}",
            "{$amount} • {$order->customer_name} • ".str_replace('_', ' ', $order->payment_status->value).($order->payment_utr ? " • UTR {$order->payment_utr}" : ''),
        );

        return back()->with('status', "#{$order->reference} and its payment were deleted.");
    }
}
