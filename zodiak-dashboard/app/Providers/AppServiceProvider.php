<?php

namespace App\Providers;

use App\Actions\ApplyIntegrationSettings;
use App\Enums\PaymentStatus;
use App\Enums\RechargeStatus;
use App\Models\ChatMessage;
use App\Models\CreditRecharge;
use App\Models\FlaggedChat;
use App\Models\Order;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(ApplyIntegrationSettings $applyIntegrationSettings): void
    {
        $applyIntegrationSettings->handle();

        // Op-Center navigation shows how many UPI payments (UTRs) are waiting for a check
        View::composer(['partials.op-header', 'dashboard', 'overview'], function ($view): void {
            $view->with('paymentsToCheck', Order::awaitingPaymentCheck()->count()
                + CreditRecharge::where('status', RechargeStatus::VerificationPending)->count());
        });

        // Counts for the sidebar menu and its sub-menus
        View::composer('partials.op-header', function ($view): void {
            $counts = [
                'approvals' => Order::awaitingReview()->count(),
                'suggestions' => ChatMessage::awaitingReview()->count(),
                'sensitive' => FlaggedChat::open()->count(),
                'dispatch' => Order::inFulfilment()->count(),
                'utrs' => Order::awaitingPaymentCheck()->count(),
                'recharges' => CreditRecharge::where('status', RechargeStatus::VerificationPending)->count(),
                'refunds' => Order::where('payment_status', PaymentStatus::RefundPending)->count(),
                'unpaid' => Order::where('payment_status', PaymentStatus::AwaitingPayment)->count()
                    + CreditRecharge::where('status', RechargeStatus::AwaitingPayment)->count(),
            ];

            $view->with([
                'menuCounts' => $counts,
                'orderStatusCounts' => Order::query()->selectRaw('status, count(*) as total')->groupBy('status')->pluck('total', 'status'),
                // Everything waiting in the Pandit queue: remedy orders to approve, held suggestions and open sensitive chats
                'panditQueueCount' => $counts['approvals'] + $counts['suggestions'] + $counts['sensitive'],
            ]);
        });
    }
}
