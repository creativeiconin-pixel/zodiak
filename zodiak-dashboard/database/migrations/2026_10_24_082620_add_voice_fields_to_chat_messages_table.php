<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('chat_messages', function (Blueprint $table) {
            $table->string('audio_path')->nullable()->after('content');
            $table->unsignedInteger('audio_duration_ms')->nullable()->after('audio_path');
            $table->json('waveform')->nullable()->after('audio_duration_ms');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('chat_messages', function (Blueprint $table) {
            $table->dropColumn(['audio_path', 'audio_duration_ms', 'waveform']);
        });
    }
};
