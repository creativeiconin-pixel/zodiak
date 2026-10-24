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
        Schema::table('orders', function (Blueprint $table) {
            $table->unsignedInteger('cost_amount')->default(0)->after('amount');
            $table->string('payment_utr', 32)->nullable()->unique()->after('payment_reference');
            $table->timestamp('payment_submitted_at')->nullable()->after('payment_utr');
            $table->timestamp('payment_verified_at')->nullable()->after('payment_submitted_at');
            $table->foreignId('payment_verified_by')->nullable()->after('payment_verified_at')->constrained('users')->nullOnDelete();
            $table->string('payment_note')->nullable()->after('payment_verified_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropConstrainedForeignId('payment_verified_by');
            $table->dropColumn(['cost_amount', 'payment_utr', 'payment_submitted_at', 'payment_verified_at', 'payment_note']);
        });
    }
};
