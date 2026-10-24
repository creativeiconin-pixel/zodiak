<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * People who signed up before credits existed get the same free welcome credits as new sign-ups.
     */
    public function up(): void
    {
        $bonus = max(0, (int) config('services.credits.signup_bonus'));

        if ($bonus === 0) {
            return;
        }

        DB::table('seekers')->where('credits', 0)->orderBy('id')->chunkById(200, function ($seekers) use ($bonus) {
            $now = now();

            DB::table('seekers')->whereIn('id', $seekers->pluck('id'))->update(['credits' => $bonus]);
            DB::table('credit_transactions')->insert($seekers->map(fn ($seeker) => [
                'seeker_id' => $seeker->id,
                'amount' => $bonus,
                'balance_after' => $bonus,
                'reason' => 'signup_bonus',
                'description' => 'Free welcome credits',
                'created_at' => $now,
                'updated_at' => $now,
            ])->all());
        });
    }

    /**
     * Credits may already be spent, so the grant is not taken back.
     */
    public function down(): void
    {
        //
    }
};
