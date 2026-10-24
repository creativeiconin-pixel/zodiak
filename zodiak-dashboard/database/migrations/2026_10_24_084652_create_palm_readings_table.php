<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Only the AI's reading is kept. The palm photo itself is never stored.
     */
    public function up(): void
    {
        Schema::create('palm_readings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seeker_id')->constrained()->cascadeOnDelete();
            $table->string('hand', 5);
            $table->string('locale', 10)->default('en');
            $table->json('result');
            $table->timestamps();

            $table->index(['seeker_id', 'id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('palm_readings');
    }
};
