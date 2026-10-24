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
        Schema::create('remedy_knowledge', function (Blueprint $table) {
            $table->id();
            $table->foreignId('remedy_id')->unique()->constrained()->cascadeOnDelete();
            $table->json('planets')->nullable();
            $table->text('best_for')->nullable();
            $table->text('suits_charts')->nullable();
            $table->text('avoid_when')->nullable();
            $table->text('how_to_use')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('remedy_knowledge');
    }
};
