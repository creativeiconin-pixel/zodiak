<?php

namespace App\Providers;

use App\Actions\ApplyIntegrationSettings;
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

        // Everything waiting in the Pandit queue: remedy orders to approve, held suggestions and open sensitive chats
        View::composer('partials.op-header', function ($view): void {
            $view->with('panditQueueCount', Order::awaitingReview()->count()
                + ChatMessage::awaitingReview()->count()
                + FlaggedChat::open()->count());
        });
    }
}
