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
        Schema::table('remedies', function (Blueprint $table) {
            $table->unsignedInteger('cost_price')->default(0)->after('compare_at_price');
            $table->boolean('is_active')->default(true)->after('sort_order');
            $table->unsignedInteger('stock')->nullable()->after('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('remedies', function (Blueprint $table) {
            $table->dropColumn(['cost_price', 'is_active', 'stock']);
        });
    }
};
