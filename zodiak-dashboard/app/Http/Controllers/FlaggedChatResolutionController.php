<?php

namespace App\Http\Controllers;

use App\Actions\RecordAuditLog;
use App\Enums\ActorType;
use App\Models\FlaggedChat;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FlaggedChatResolutionController extends Controller
{
    /**
     * Close a sensitive-chat escalation once a human pandit has followed up.
     */
    public function store(Request $request, FlaggedChat $flaggedChat, RecordAuditLog $recordAuditLog): RedirectResponse
    {
        abort_if($flaggedChat->resolved_at !== null, 409, 'This escalation is already resolved.');

        DB::transaction(function () use ($request, $flaggedChat, $recordAuditLog): void {
            $flaggedChat->forceFill(['resolved_at' => now()])->save();

            $recordAuditLog->handle(
                $request->user()->name,
                ActorType::Pandit,
                'Resolved Sensitive Chat',
                $flaggedChat->session_reference,
                "Human follow-up completed for {$flaggedChat->flag_type->label()}.",
            );
        });

        return back()->with('status', "{$flaggedChat->session_reference} resolved");
    }
}
