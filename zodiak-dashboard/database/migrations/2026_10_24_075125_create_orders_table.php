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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->foreignId('remedy_id')->constrained();
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->string('address_line');
            $table->string('city_postal');
            $table->string('lagna')->nullable();
            $table->string('nakshatra')->nullable();
            $table->string('gotra')->nullable();
            $table->unsignedInteger('amount');
            $table->string('specification');
            $table->string('status')->index();
            $table->string('payment_status');
            $table->string('payment_reference')->nullable();
            $table->string('ai_rationale_title')->nullable();
            $table->text('ai_rationale')->nullable();
            $table->unsignedTinyInteger('chart_compatibility')->nullable();
            $table->boolean('is_high_risk')->default(false);
            $table->string('muhurat')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('consecrated_at')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
