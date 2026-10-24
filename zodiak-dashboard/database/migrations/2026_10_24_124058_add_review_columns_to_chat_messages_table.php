<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Pandit Jii answers that a human Pandit must look at: a product suggestion that does not match the knowledge base,
     * or a chat the seeker reported.
     */
    public function up(): void
    {
        Schema::table('chat_messages', function (Blueprint $table) {
            $table->string('review_status')->nullable()->index()->after('is_flagged');
            $table->json('review_reasons')->nullable()->after('review_status');
            $table->timestamp('reported_at')->nullable()->after('review_reasons');
            $table->string('report_reason', 500)->nullable()->after('reported_at');
            $table->foreignId('reviewed_by')->nullable()->after('report_reason')->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable()->after('reviewed_by');
            $table->string('review_note', 500)->nullable()->after('reviewed_at');
        });
    }

    public function down(): void
    {
        Schema::table('chat_messages', function (Blueprint $table) {
            $table->dropConstrainedForeignId('reviewed_by');
            $table->dropColumn(['review_status', 'review_reasons', 'reported_at', 'report_reason', 'reviewed_at', 'review_note']);
        });
    }
};
