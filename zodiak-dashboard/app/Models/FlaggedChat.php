<?php

namespace App\Models;

use App\Enums\FlagType;
use Database\Factories\FlaggedChatFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'user_name', 'user_reference', 'session_reference', 'flag_type', 'trigger_label', 'transit_axis', 'summary',
    'action_taken', 'assigned_to', 'flagged_at', 'resolved_at',
])]
class FlaggedChat extends Model
{
    /** @use HasFactory<FlaggedChatFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'flag_type' => FlagType::class,
            'flagged_at' => 'datetime',
            'resolved_at' => 'datetime',
        ];
    }

    #[Scope]
    protected function open(Builder $query): void
    {
        $query->whereNull('resolved_at');
    }
}
