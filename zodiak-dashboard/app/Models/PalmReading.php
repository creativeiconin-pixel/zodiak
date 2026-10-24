<?php

namespace App\Models;

use Database\Factories\PalmReadingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * An AI palm reading. Only the structured result is stored; the photo is processed in memory and discarded.
 */
#[Fillable(['seeker_id', 'hand', 'locale', 'result'])]
class PalmReading extends Model
{
    /** @use HasFactory<PalmReadingFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'result' => 'array',
        ];
    }

    /**
     * @return BelongsTo<Seeker, $this>
     */
    public function seeker(): BelongsTo
    {
        return $this->belongsTo(Seeker::class);
    }
}
