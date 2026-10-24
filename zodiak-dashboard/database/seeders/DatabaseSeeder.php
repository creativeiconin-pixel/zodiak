<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Acharya Sharma',
            'title' => 'Senior Pandit',
            'email' => 'pandit@zodiak.test',
        ]);

        $this->call([
            SeekerSeeder::class,
            RemedySeeder::class,
            OrderSeeder::class,
            FlaggedChatSeeder::class,
            AuditLogSeeder::class,
        ]);
    }
}
