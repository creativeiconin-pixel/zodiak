<?php

namespace App\Http\Controllers;

use App\Actions\CreditWallet;
use App\Actions\RecordAuditLog;
use App\Enums\ActorType;
use App\Models\Seeker;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SeekerCreditController extends Controller
{
    /**
     * Add (or take back) credits by hand, e.g. as a goodwill gift or to fix a mistake.
     */
    public function store(Request $request, Seeker $seeker, CreditWallet $wallet, RecordAuditLog $recordAuditLog): RedirectResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'integer', 'between:-10000,10000', 'not_in:0'],
            'reason' => ['required', 'string', 'max:120'],
        ]);

        $transaction = $wallet->adjust($seeker, (int) $validated['amount'], $validated['reason'], $request->user());

        $recordAuditLog->handle($request->user()->name, ActorType::Pandit, 'Credits Adjusted', "#US-{$seeker->id}", sprintf('%+d credits: %s', $transaction->amount, $validated['reason']));

        return back()->with('status', sprintf('%+d credits for %s. New balance: %d.', $transaction->amount, $seeker->name, $transaction->balance_after));
    }
}
