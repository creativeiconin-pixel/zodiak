<?php

namespace Database\Seeders;

use App\Actions\RecordAuditLog;
use App\Enums\ActorType;
use App\Models\AuditLog;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class AuditLogSeeder extends Seeder
{
    /**
     * Seed the opening entries of the hash-chained audit trail.
     */
    public function run(RecordAuditLog $recordAuditLog): void
    {
        if (AuditLog::exists()) {
            return;
        }

        $entries = [
            ['11:15:44', 'Temple Priest Govind', ActorType::Priest, 'Consecration Completed', '#ZK-88410', '108 Gayatri Jaap recorded; digital proof & consecrated yantra dispatched'],
            ['12:30:11', 'Acharya Ramanathan', ActorType::Pandit, 'Rejected Diamond Prescription', '#ZK-88902', 'Incompatible with Scorpio Lagna (Venus functional malefic). 100% refund ₹34,000 processed.'],
            ['13:48:19', 'AI System (Brihaspati v4)', ActorType::Ai, 'Auto-Flagged Sensitive Chat', '#CT-4091', 'Routed to human intervention; blocked suicide / distress outcome projections'],
        ];

        foreach ($entries as [$time, $actorName, $actorType, $action, $reference, $outcome]) {
            Carbon::setTestNow(today('Asia/Kolkata')->setTimeFromTimeString($time)->utc());
            $recordAuditLog->handle($actorName, $actorType, $action, $reference, $outcome);
        }

        Carbon::setTestNow();
    }
}
