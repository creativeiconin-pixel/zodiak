<?php

namespace App\Http\Controllers;

use App\Enums\PaymentStatus;
use App\Enums\RechargeStatus;
use App\Models\CreditRecharge;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\View\View;

class PaymentController extends Controller
{
    /**
     * UPI payments (orders and credit recharges) waiting for a UTR check, followed by recent payment history.
     */
    public function __invoke(Request $request): View
    {
        $toVerify = Order::with('remedy')->where('payment_status', PaymentStatus::VerificationPending)->oldest('payment_submitted_at')->get();

        $history = Order::with(['remedy', 'paymentVerifier'])
            ->whereIn('payment_status', [PaymentStatus::EscrowHeld, PaymentStatus::Captured, PaymentStatus::Failed, PaymentStatus::RefundPending, PaymentStatus::Refunded])
            ->latest('updated_at')
            ->paginate(20);

        return view('payments.index', [
            'toVerify' => $toVerify,
            'rechargesToVerify' => CreditRecharge::with('seeker:id,name,phone,email')->where('status', RechargeStatus::VerificationPending)->oldest('payment_submitted_at')->get(),
            'recentRecharges' => CreditRecharge::with(['seeker:id,name', 'paymentVerifier:id,name'])->whereIn('status', [RechargeStatus::Credited, RechargeStatus::Rejected])->latest('updated_at')->limit(10)->get(),
            'history' => $history,
            'awaitingCount' => Order::where('payment_status', PaymentStatus::AwaitingPayment)->count(),
            'awaitingOrders' => Order::with('remedy:id,name')->where('payment_status', PaymentStatus::AwaitingPayment)->latest()->limit(30)->get(),
            'unpaidRecharges' => CreditRecharge::with('seeker:id,name')->where('status', RechargeStatus::AwaitingPayment)->latest()->limit(30)->get(),
            'refundPending' => Order::where('payment_status', PaymentStatus::RefundPending)->get(['id', 'reference', 'customer_name', 'amount', 'customer_phone']),
            'collectedToday' => (int) Order::paid()->whereDate('payment_verified_at', today())->sum('amount')
                + (int) CreditRecharge::where('status', RechargeStatus::Credited)->whereDate('payment_verified_at', today())->sum('amount'),
        ]);
    }
}
