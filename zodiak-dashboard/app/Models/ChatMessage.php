<?php

namespace App\Models;

use Database\Factories\ChatMessageFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'seeker_id', 'role', 'content', 'audio_path', 'audio_duration_ms', 'waveform', 'remedy_slug', 'is_flagged',
    'review_status', 'review_reasons', 'reported_at', 'report_reason',
])]
class ChatMessage extends Model
{
    /** @use HasFactory<ChatMessageFactory> */
    use HasFactory;

    /** Waiting for a human Pandit: a suggestion that failed the knowledge-base check, or a reported chat. */
    public const REVIEW_PENDING = 'pending';

    /** A Pandit approved the answer and its product suggestion. */
    public const REVIEW_APPROVED = 'approved';

    /** A Pandit took the product suggestion off the answer. */
    public const REVIEW_REMOVED = 'removed';

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_flagged' => 'boolean',
            'audio_duration_ms' => 'integer',
            'waveform' => 'array',
            'review_reasons' => 'array',
            'reported_at' => 'datetime',
            'reviewed_at' => 'datetime',
        ];
    }

    #[Scope]
    protected function awaitingReview(Builder $query): void
    {
        $query->where('review_status', self::REVIEW_PENDING);
    }

    /**
     * Whether the seeker may see and buy the suggested product. A suggestion that failed the knowledge-base check
     * stays hidden until a Pandit approves it; one a Pandit removed never shows.
     */
    public function showsRemedy(): bool
    {
        return match ($this->review_status) {
            self::REVIEW_REMOVED => false,
            self::REVIEW_PENDING => blank($this->review_reasons),
            default => true,
        };
    }

    /**
     * The seeker's question this answer replied to.
     */
    public function question(): ?self
    {
        return static::where('seeker_id', $this->seeker_id)->where('role', 'user')->where('id', '<', $this->id)->latest('id')->first();
    }

    /**
     * @return BelongsTo<Remedy, $this>
     */
    public function remedy(): BelongsTo
    {
        return $this->belongsTo(Remedy::class, 'remedy_slug', 'slug');
    }

    /**
     * @return BelongsTo<Seeker, $this>
     */
    public function seeker(): BelongsTo
    {
        return $this->belongsTo(Seeker::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
