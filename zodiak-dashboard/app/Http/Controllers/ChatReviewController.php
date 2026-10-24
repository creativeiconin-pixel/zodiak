<?php

namespace App\Http\Controllers;

use App\Actions\RecordAuditLog;
use App\Enums\ActorType;
use App\Models\ChatMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ChatReviewController extends Controller
{
    /**
     * A human Pandit approves a held or reported Pandit Jii answer, or takes its product suggestion off.
     */
    public function store(Request $request, ChatMessage $chatMessage, RecordAuditLog $recordAuditLog): RedirectResponse
    {
        abort_unless($chatMessage->review_status === ChatMessage::REVIEW_PENDING, 409, 'This answer is already reviewed.');

        $validated = $request->validate([
            'decision' => ['required', Rule::in([ChatMessage::REVIEW_APPROVED, ChatMessage::REVIEW_REMOVED])],
            'note' => ['nullable', 'string', 'max:500'],
        ]);
        $reference = "#CT-{$chatMessage->id}";

        DB::transaction(function () use ($request, $chatMessage, $validated, $reference, $recordAuditLog): void {
            $chatMessage->forceFill([
                'review_status' => $validated['decision'],
                'reviewed_by' => $request->user()->id,
                'reviewed_at' => now(),
                'review_note' => $validated['note'] ?? null,
            ])->save();

            $recordAuditLog->handle(
                $request->user()->name,
                ActorType::Pandit,
                $validated['decision'] === ChatMessage::REVIEW_APPROVED ? 'Approved Pandit Jii Answer' : 'Removed Product Suggestion',
                $reference,
                $validated['decision'] === ChatMessage::REVIEW_APPROVED
                    ? ($chatMessage->remedy_slug ? "Suggestion {$chatMessage->remedy_slug} approved and shown to the seeker." : 'Reported answer checked and approved.')
                    : "Suggestion {$chatMessage->remedy_slug} taken off the answer.",
            );
        });

        return back()->with('status', $validated['decision'] === ChatMessage::REVIEW_APPROVED ? "{$reference} approved" : "{$reference}: product suggestion removed");
    }
}
