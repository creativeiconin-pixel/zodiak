<?php

namespace App\Http\Controllers;

use App\Actions\RecordAuditLog;
use App\Enums\ActorType;
use App\Models\CreditRecharge;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Number;

class AdminCreditRechargeController extends Controller
{
    /**
     * Delete a credit recharge that was never credited (unpaid, waiting, or rejected).
     */
    public function destroy(Request $request, CreditRecharge $creditRecharge, RecordAuditLog $recordAuditLog): RedirectResponse
    {
        if (! $creditRecharge->canBeDeleted()) {
            return back()->withErrors(['delete' => "#{$creditRecharge->reference} already added credits. Change the user's credits on their page instead."]);
        }

        $creditRecharge->loadMissing('seeker:id,name');
        $amount = Number::currency($creditRecharge->amount, 'INR', 'en_IN', 0);
        $creditRecharge->delete();

        $recordAuditLog->handle(
            $request->user()->name,
            ActorType::Pandit,
            'Credit Recharge Deleted',
            "#{$creditRecharge->reference}",
            "{$amount} for {$creditRecharge->credits} credits • {$creditRecharge->seeker?->name} • {$creditRecharge->status->value}".($creditRecharge->payment_utr ? " • UTR {$creditRecharge->payment_utr}" : ''),
        );

        return back()->with('status', "#{$creditRecharge->reference} was deleted.");
    }
}
