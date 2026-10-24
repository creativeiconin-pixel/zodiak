<?php

use App\Http\Controllers\AdminCreditRechargeController;
use App\Http\Controllers\AdminOrderController;
use App\Http\Controllers\AgentController;
use App\Http\Controllers\Auth\SessionController;
use App\Http\Controllers\ChatReviewController;
use App\Http\Controllers\CreditRechargeVerificationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FlaggedChatResolutionController;
use App\Http\Controllers\IntegrationConnectionTestController;
use App\Http\Controllers\IntegrationSettingsController;
use App\Http\Controllers\KnowledgeBaseController;
use App\Http\Controllers\OrderFulfilmentController;
use App\Http\Controllers\OrderReviewController;
use App\Http\Controllers\OverviewController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PaymentVerificationController;
use App\Http\Controllers\PineLabsCallbackController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RefundController;
use App\Http\Controllers\SeekerController;
use App\Http\Controllers\SeekerCreditController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/admin');

Route::match(['get', 'post'], 'payments/pinelabs/callback/{order}', PineLabsCallbackController::class)
    ->middleware('throttle:30,1')
    ->name('payments.pinelabs.callback');

// The pandit Op-Center lives under /admin; the seeker React app owns every other path on the domain.
Route::prefix('admin')->group(function () {
    Route::redirect('/', '/admin/overview');

    Route::middleware('guest:web')->group(function () {
        Route::get('login', [SessionController::class, 'create'])->name('login');
        Route::post('login', [SessionController::class, 'store'])->middleware('throttle:5,1')->name('login.store');
    });

    Route::middleware('auth:web')->group(function () {
        Route::post('logout', [SessionController::class, 'destroy'])->name('logout');

        Route::get('overview', OverviewController::class)->name('overview');
        Route::get('agents', [AgentController::class, 'index'])->name('agents.index');
        Route::put('agents/{agent}', [AgentController::class, 'update'])->name('agents.update');
        Route::get('dashboard', DashboardController::class)->name('dashboard');
        Route::get('orders', [AdminOrderController::class, 'index'])->name('orders.index');
        Route::get('orders/{order}', [AdminOrderController::class, 'show'])->name('orders.show');
        Route::delete('orders/{order}', [AdminOrderController::class, 'destroy'])->name('orders.destroy');
        Route::delete('credit-recharges/{creditRecharge}', [AdminCreditRechargeController::class, 'destroy'])->name('credit-recharges.destroy');
        Route::get('payments', PaymentController::class)->name('payments.index');
        Route::resource('products', ProductController::class)->except(['show', 'destroy']);
        Route::post('products/{product}/toggle', [ProductController::class, 'toggle'])->name('products.toggle');
        Route::get('knowledge', [KnowledgeBaseController::class, 'index'])->name('knowledge.index');
        Route::get('knowledge/{product}/edit', [KnowledgeBaseController::class, 'edit'])->name('knowledge.edit');
        Route::put('knowledge/{product}', [KnowledgeBaseController::class, 'update'])->name('knowledge.update');
        Route::get('users', [SeekerController::class, 'index'])->name('seekers.index');
        Route::get('users/{seeker}', [SeekerController::class, 'show'])->name('seekers.show');
        Route::post('users/{seeker}/credits', [SeekerCreditController::class, 'store'])->name('seekers.credits.store');
        Route::post('credit-recharges/{creditRecharge}/verification', [CreditRechargeVerificationController::class, 'store'])->name('credit-recharges.verification.store');

        Route::post('orders/{order}/refund', RefundController::class)->name('orders.refund.store');
        Route::post('orders/{order}/payment-verification', [PaymentVerificationController::class, 'store'])->name('orders.payment-verification.store');
        Route::post('orders/{order}/review', [OrderReviewController::class, 'store'])->name('orders.review.store');
        Route::post('orders/{order}/fulfilment', [OrderFulfilmentController::class, 'store'])->name('orders.fulfilment.store');
        Route::get('settings/integrations', [IntegrationSettingsController::class, 'edit'])->name('settings.integrations.edit');
        Route::put('settings/integrations', [IntegrationSettingsController::class, 'update'])->name('settings.integrations.update');
        Route::post('settings/integrations/{integration}/test', [IntegrationConnectionTestController::class, 'store'])->middleware('throttle:10,1')->name('settings.integrations.test');
        Route::post('chat-reviews/{chatMessage}', [ChatReviewController::class, 'store'])->name('chat-reviews.store');
        Route::post('flagged-chats/{flaggedChat}/resolution', [FlaggedChatResolutionController::class, 'store'])->name('flagged-chats.resolution.store');
    });
});
