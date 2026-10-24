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
        Schema::create('flagged_chats', function (Blueprint $table) {
            $table->id();
            $table->string('user_name');
            $table->string('user_reference');
            $table->string('session_reference')->unique();
            $table->string('flag_type');
            $table->string('trigger_label');
            $table->string('transit_axis');
            $table->text('summary');
            $table->text('action_taken');
            $table->string('assigned_to')->nullable();
            $table->timestamp('flagged_at');
            $table->timestamp('resolved_at')->nullable()->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flagged_chats');
    }
};
