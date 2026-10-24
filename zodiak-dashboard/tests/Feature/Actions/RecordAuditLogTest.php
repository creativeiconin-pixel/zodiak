<?php

namespace Tests\Feature\Actions;

use App\Actions\RecordAuditLog;
use App\Enums\ActorType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RecordAuditLogTest extends TestCase
{
    use RefreshDatabase;

    public function test_first_entry_has_no_previous_hash(): void
    {
        $entry = app(RecordAuditLog::class)->handle('Pandit Shastri', ActorType::Pandit, 'Approved Remedy', '#ZK-10001', 'Cleared');

        $this->assertNull($entry->previous_hash);
        $this->assertMatchesRegularExpression('/^[0-9a-f]{64}$/', $entry->hash);
    }

    public function test_each_entry_chains_to_the_previous_hash(): void
    {
        $recordAuditLog = app(RecordAuditLog::class);

        $first = $recordAuditLog->handle('Pandit Shastri', ActorType::Pandit, 'Approved Remedy', '#ZK-10001', 'Cleared');
        $second = $recordAuditLog->handle('AI System', ActorType::Ai, 'Auto-Flagged Sensitive Chat', '#CT-1', 'Routed');

        $this->assertSame($first->hash, $second->previous_hash);
        $this->assertNotSame($first->hash, $second->hash);
    }
}
