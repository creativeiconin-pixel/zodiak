<?php

use App\Http\Controllers\Api\V1\AppConfigController;
use App\Http\Controllers\Api\V1\AskController;
use App\Http\Controllers\Api\V1\Auth\OtpController;
use App\Http\Controllers\Api\V1\Auth\RegisteredSeekerController;
use App\Http\Controllers\Api\V1\Auth\SeekerSessionController;
use App\Http\Controllers\Api\V1\BirthDetailsController;
use App\Http\Controllers\Api\V1\ChatAudioController;
use App\Http\Controllers\Api\V1\ChatReportController;
use App\Http\Controllers\Api\V1\CreditController;
use App\Http\Controllers\Api\V1\CreditRechargeController;
use App\Http\Controllers\Api\V1\CreditRechargePaymentProofController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\PalmReadingController;
use App\Http\Controllers\Api\V1\PaymentProofController;
use App\Http\Controllers\Api\V1\ProfileController;
use App\Http\Controllers\Api\V1\RemedyController;
use App\Http\Controllers\Api\V1\SeekerOrderController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->name('api.v1.')->group(function () {
    Route::get('app-config', AppConfigController::class)->name('app-config');

    Route::apiResource('remedies', RemedyController::class)->only(['index', 'show']);

    Route::post('orders', [OrderController::class, 'store'])->middleware('throttle:10,1')->name('orders.store');
    Route::get('orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::post('orders/{order}/payment-proof', PaymentProofController::class)->middleware('throttle:10,1')->name('orders.payment-proof');

    Route::prefix('auth')->name('auth.')->middleware('throttle:10,1')->group(function () {
        Route::post('otp', [OtpController::class, 'store'])->name('otp.store');
        Route::post('otp/verify', [OtpController::class, 'verify'])->name('otp.verify');
        Route::post('register', [RegisteredSeekerController::class, 'store'])->name('register');
        Route::post('login', [SeekerSessionController::class, 'store'])->name('login');
        Route::post('logout', [SeekerSessionController::class, 'destroy'])->middleware('auth:sanctum')->name('logout');
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('me', [ProfileController::class, 'show'])->name('me.show');
        Route::put('me/birth-details', [BirthDetailsController::class, 'update'])->name('me.birth-details.update');
        Route::get('me/orders', [SeekerOrderController::class, 'index'])->name('me.orders.index');
        Route::get('ask', [AskController::class, 'index'])->name('ask.index');
        Route::post('ask', [AskController::class, 'store'])->middleware('throttle:15,1')->name('ask.store');
        Route::get('ask/messages/{chatMessage}/audio', ChatAudioController::class)->name('ask.audio');
        Route::post('ask/messages/{chatMessage}/report', ChatReportController::class)->middleware('throttle:10,1')->name('ask.report');
        Route::get('palm-readings', [PalmReadingController::class, 'index'])->name('palm-readings.index');
        Route::post('palm-readings', [PalmReadingController::class, 'store'])->middleware('throttle:6,1')->name('palm-readings.store');
        Route::get('credits', CreditController::class)->name('credits.show');
        Route::post('credit-recharges', [CreditRechargeController::class, 'store'])->middleware('throttle:10,1')->name('credit-recharges.store');
        Route::get('credit-recharges/{reference}', [CreditRechargeController::class, 'show'])->name('credit-recharges.show');
        Route::post('credit-recharges/{reference}/payment-proof', CreditRechargePaymentProofController::class)->middleware('throttle:10,1')->name('credit-recharges.payment-proof');
    });
});
