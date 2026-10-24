<?php

namespace App\Actions;

use App\Enums\ActorType;
use App\Models\AuditLog;
use Illuminate\Support\Facades\DB;

class RecordAuditLog
{
    /**
     * Append an entry to the audit trail, chaining its hash to the previous entry so tampering is detectable.
     */
    public function handle(string $actorName, ActorType $actorType, string $action, string $referenceToken, string $outcome): AuditLog
    {
        return DB::transaction(function () use ($actorName, $actorType, $action, $referenceToken, $outcome): AuditLog {
            $previousHash = AuditLog::query()->latest('id')->lockForUpdate()->value('hash');
            $createdAt = now();

            return AuditLog::create([
                'actor_name' => $actorName,
                'actor_type' => $actorType,
                'action' => $action,
                'reference_token' => $referenceToken,
                'outcome' => $outcome,
                'previous_hash' => $previousHash,
                'hash' => hash('sha256', implode('|', [
                    $previousHash, $actorName, $actorType->value, $action, $referenceToken, $outcome, $createdAt->toIso8601String(),
                ])),
                'created_at' => $createdAt,
            ]);
        });
    }
}
