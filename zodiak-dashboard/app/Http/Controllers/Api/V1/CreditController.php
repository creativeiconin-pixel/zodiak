<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\CreditWallet;
use App\Enums\RechargeStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\CreditRechargeResource;
use App\Http\Resources\CreditTransactionResource;
use App\Models\Seeker;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CreditController extends Controller
{
    /**
     * The seeker's credit balance, what things cost, the recharge packs and their recent credit history.
     */
    public function __invoke(Request $request, CreditWallet $wallet): JsonResponse
    {
        /** @var Seeker $seeker */
        $seeker = $request->user();

        return response()->json(['data' => [
            'balance' => $seeker->credits,
            'costs' => ['question' => $wallet->questionCost(), 'palm_reading' => $wallet->palmReadingCost()],
            'signup_bonus' => $wallet->signupBonus(),
            'packs' => $wallet->packs(),
            'recharge_available' => filled(config('services.upi.vpa')) && $wallet->packs() !== [],
            'open_recharges' => CreditRechargeResource::collection(
                $seeker->creditRecharges()->whereIn('status', [RechargeStatus::AwaitingPayment, RechargeStatus::VerificationPending, RechargeStatus::Rejected])->latest('id')->limit(3)->get()
            ),
            'history' => CreditTransactionResource::collection($seeker->creditTransactions()->latest('id')->limit(30)->get()),
        ]]);
    }
}
