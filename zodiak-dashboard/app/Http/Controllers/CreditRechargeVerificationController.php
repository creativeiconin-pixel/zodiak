<?php

namespace App\Http\Controllers;

use App\Actions\CreditWallet;
use App\Actions\RecordAuditLog;
use App\Enums\ActorType;
use App\Enums\RechargeStatus;
use App\Models\CreditRecharge;
use App\Models\CreditTransaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Number;

class CreditRechargeVerificationController extends Controller
{
    /**
     * Add the credits once the UTR is found in the bank statement, or reject it with a reason.
     */
    public function store(Request $request, CreditRecharge $creditRecharge, CreditWallet $wallet, RecordAuditLog $recordAuditLog): RedirectResponse
    {
        $validated = $request->validate([
            'decision' => ['required', 'in:verify,reject'],
            'note' => ['nullable', 'required_if:decision,reject', 'string', 'max:200'],
        ], ['note.required_if' => 'Write a short reason so the customer knows what to fix.']);

        $user = $request->user();
        $verified = $validated['decision'] === 'verify';
        $amount = Number::currency($creditRecharge->amount, 'INR', 'en_IN', 0);

        DB::transaction(function () use ($creditRecharge, $user, $verified, $validated, $amount, $wallet, $recordAuditLog): void {
            // Lock the row so a double click can never add the credits twice
            $recharge = CreditRecharge::whereKey($creditRecharge->id)->lockForUpdate()->firstOrFail();
            abort_unless($recharge->status === RechargeStatus::VerificationPending, 409, 'This recharge is not waiting for a check.');

            if ($verified) {
                $recharge->forceFill(['status' => RechargeStatus::Credited, 'payment_verified_at' => now(), 'payment_verified_by' => $user->id])->save();
                $wallet->add($recharge->seeker, $recharge->credits, CreditTransaction::RECHARGE, "Recharge {$recharge->reference}", $recharge, $user);
            } else {
                $recharge->forceFill(['status' => RechargeStatus::Rejected, 'payment_note' => $validated['note']])->save();
            }

            $recordAuditLog->handle(
                $user->name,
                ActorType::Pandit,
                $verified ? 'Credit Recharge Verified' : 'Credit Recharge Rejected',
                "#{$recharge->reference}",
                $verified ? "UTR {$recharge->payment_utr} matched for {$amount}. Added {$recharge->credits} credits." : "UTR {$recharge->payment_utr} not found: {$validated['note']}",
            );
        });

        return back()->with('status', "#{$creditRecharge->reference}: ".($verified ? "{$creditRecharge->credits} credits added" : 'recharge rejected'));
    }
}
