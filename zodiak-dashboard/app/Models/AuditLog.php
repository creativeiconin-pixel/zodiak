<?php

namespace App\Models;

use App\Enums\ActorType;
use Database\Factories\AuditLogFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['actor_name', 'actor_type', 'action', 'reference_token', 'outcome', 'previous_hash', 'hash', 'created_at'])]
class AuditLog extends Model
{
    /** @use HasFactory<AuditLogFactory> */
    use HasFactory;

    public const UPDATED_AT = null;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'actor_type' => ActorType::class,
            'created_at' => 'datetime',
        ];
    }

    /**
     * The hash shortened for display, e.g. "0x7f4a...9b12".
     */
    public function shortHash(): string
    {
        return '0x'.substr($this->hash, 0, 4).'...'.substr($this->hash, -4);
    }
}
