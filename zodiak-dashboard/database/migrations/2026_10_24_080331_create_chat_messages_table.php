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
        Schema::create('chat_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seeker_id')->constrained()->cascadeOnDelete();
            $table->string('role');
            $table->text('content');
            $table->string('remedy_slug')->nullable();
            $table->boolean('is_flagged')->default(false);
            $table->timestamps();

            $table->index(['seeker_id', 'id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_messages');
    }
};
