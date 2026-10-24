<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Rising signs each launch product traditionally suits or should be avoided for. Products avoided for a
     * person's rising sign are removed before Pandit Jii sees the shop, so he can never suggest them.
     *
     * @var array<string, array{good: list<string>, avoid: list<string>}>
     */
    private const SIGNS = [
        'ceylon-yellow-sapphire-ring' => ['good' => ['Aries', 'Cancer', 'Leo', 'Scorpio', 'Sagittarius', 'Pisces'], 'avoid' => ['Taurus', 'Libra', 'Capricorn', 'Aquarius']],
        'zambian-emerald-panna-ring' => ['good' => ['Taurus', 'Gemini', 'Virgo', 'Libra', 'Capricorn', 'Aquarius'], 'avoid' => ['Aries', 'Cancer', 'Scorpio']],
        'kashmir-blue-sapphire-neelam' => ['good' => ['Taurus', 'Libra', 'Capricorn', 'Aquarius'], 'avoid' => ['Aries', 'Cancer', 'Leo', 'Scorpio']],
        'italian-red-coral-moonga' => ['good' => ['Aries', 'Cancer', 'Leo', 'Scorpio', 'Sagittarius', 'Pisces'], 'avoid' => ['Taurus', 'Gemini', 'Virgo', 'Libra', 'Aquarius']],
    ];

    public function up(): void
    {
        Schema::table('remedy_knowledge', function (Blueprint $table) {
            $table->json('good_signs')->nullable()->after('planets');
            $table->json('avoid_signs')->nullable()->after('good_signs');
        });

        foreach (self::SIGNS as $slug => $signs) {
            $remedyId = DB::table('remedies')->where('slug', $slug)->value('id');

            if ($remedyId !== null) {
                DB::table('remedy_knowledge')->where('remedy_id', $remedyId)->update([
                    'good_signs' => json_encode($signs['good']),
                    'avoid_signs' => json_encode($signs['avoid']),
                ]);
            }
        }
    }

    public function down(): void
    {
        Schema::table('remedy_knowledge', function (Blueprint $table) {
            $table->dropColumn(['good_signs', 'avoid_signs']);
        });
    }
};
