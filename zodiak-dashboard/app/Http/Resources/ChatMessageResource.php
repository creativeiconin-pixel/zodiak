<?php

namespace App\Http\Resources;

use App\Models\ChatMessage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin ChatMessage
 */
class ChatMessageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $isAssistant = $this->role === 'assistant';

        return [
            'id' => $this->id,
            'role' => $this->role,
            'text' => $isAssistant ? null : $this->content,
            'answer' => $isAssistant ? json_decode($this->content, true) : null,
            'audio' => $this->audio_path === null ? null : [
                'url' => route('api.v1.ask.audio', $this->resource, absolute: false),
                'duration_ms' => $this->audio_duration_ms,
                'waveform' => $this->waveform ?? [],
            ],
            'remedy' => $this->showsRemedy() ? new RemedyResource($this->whenLoaded('remedy')) : null,
            'is_flagged' => $this->is_flagged,
            'review' => $isAssistant ? [
                'status' => $this->review_status,
                'remedy_on_hold' => $this->remedy_slug !== null && ! $this->showsRemedy(),
                'reported' => $this->reported_at !== null,
                'note' => $this->review_note,
            ] : null,
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
