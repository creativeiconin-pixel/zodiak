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
        Schema::create('credit_recharges', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->foreignId('seeker_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('credits');
            $table->unsignedInteger('amount');
            $table->string('status')->default('awaiting_payment')->index();
            $table->string('payment_utr', 12)->nullable()->unique();
            $table->timestamp('payment_submitted_at')->nullable();
            $table->timestamp('payment_verified_at')->nullable();
            $table->foreignId('payment_verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('payment_note')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('credit_recharges');
    }
};
