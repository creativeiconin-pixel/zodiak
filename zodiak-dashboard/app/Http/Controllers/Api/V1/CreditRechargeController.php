<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\CreditWallet;
use App\Enums\RechargeStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\CreditRechargeResource;
use App\Models\CreditRecharge;
use App\Models\Seeker;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class CreditRechargeController extends Controller
{
    /**
     * Start a credit recharge: the seeker picks a pack and gets a UPI QR to pay.
     */
    public function store(Request $request, CreditWallet $wallet): JsonResponse
    {
        if (blank(config('services.upi.vpa'))) {
            return response()->json(['message' => __('Recharge is not available yet. Please try again later.')], 503);
        }

        $validated = $request->validate(['pack' => ['required', 'string', 'max:30']]);
        $pack = $wallet->pack($validated['pack']);

        if ($pack === null) {
            throw ValidationException::withMessages(['pack' => __('Please choose a recharge pack.')]);
        }

        /** @var Seeker $seeker */
        $seeker = $request->user();

        // Reuse an unpaid recharge for the same pack instead of piling up empty ones
        $recharge = $seeker->creditRecharges()
            ->where('status', RechargeStatus::AwaitingPayment)
            ->where('credits', $pack['credits'])
            ->where('amount', $pack['price'])
            ->first()
            ?? $seeker->creditRecharges()->create([
                'reference' => CreditRecharge::newReference(),
                'credits' => $pack['credits'],
                'amount' => $pack['price'],
                'status' => RechargeStatus::AwaitingPayment,
            ]);

        return (new CreditRechargeResource($recharge))->response()->setStatusCode($recharge->wasRecentlyCreated ? 201 : 200);
    }

    /**
     * One of the seeker's own recharges (the app checks it while the team verifies the UTR).
     */
    public function show(Request $request, string $reference): CreditRechargeResource
    {
        return new CreditRechargeResource($request->user()->creditRecharges()->where('reference', $reference)->firstOrFail());
    }
}
