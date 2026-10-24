<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\CheckRemedySuggestion;
use App\Actions\RecordAuditLog;
use App\Enums\ActorType;
use App\Http\Controllers\Controller;
use App\Http\Resources\ChatMessageResource;
use App\Models\ChatMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ChatReportController extends Controller
{
    /**
     * The seeker reports a Pandit Jii answer. Its product suggestion is checked against the knowledge base again, and the
     * answer goes to the Pandit team's approval queue. A suggestion that fails the check is hidden until a Pandit decides.
     */
    public function __invoke(Request $request, ChatMessage $chatMessage, CheckRemedySuggestion $checkSuggestion, RecordAuditLog $recordAuditLog): ChatMessageResource
    {
        $seeker = $request->user();
        abort_unless($chatMessage->seeker_id === $seeker->id && $chatMessage->role === 'assistant', 404);

        $validated = $request->validate(['reason' => ['nullable', 'string', 'max:500']]);
        $problems = $chatMessage->remedy ? $checkSuggestion->problems($chatMessage->remedy, $seeker->chart_details, $seeker) : [];

        DB::transaction(function () use ($chatMessage, $validated, $problems, $seeker, $recordAuditLog): void {
            $chatMessage->forceFill([
                'review_status' => ChatMessage::REVIEW_PENDING,
                'review_reasons' => $problems === [] ? null : $problems,
                'reported_at' => now(),
                'report_reason' => $validated['reason'] ?? null,
                'reviewed_by' => null,
                'reviewed_at' => null,
                'review_note' => null,
            ])->save();

            $recordAuditLog->handle($seeker->name, ActorType::Seeker, 'Reported Chat', "#CT-{$chatMessage->id}", $problems === []
                ? 'Sent to the Pandit team. Knowledge-base check passed.'
                : 'Sent to the Pandit team. Knowledge-base check failed: '.implode(' ', $problems));
        });

        return new ChatMessageResource($chatMessage->load('remedy'));
    }
}
