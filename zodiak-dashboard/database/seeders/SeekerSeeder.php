<?php

namespace Database\Seeders;

use App\Models\Seeker;
use Illuminate\Database\Seeder;

class SeekerSeeder extends Seeder
{
    /**
     * Seed a demo seeker (ananya@zodiak.test / password) with saved birth details.
     */
    public function run(): void
    {
        Seeker::updateOrCreate(['email' => 'ananya@zodiak.test'], [
            'name' => 'Ananya Sharma',
            'phone' => '+919876543210',
            'password' => 'password',
            'gender' => 'female',
            'birth_date' => '1996-10-14',
            'birth_time' => '06:42',
            'birth_time_unknown' => false,
            'birth_place' => 'New Delhi, Delhi, India',
            'birth_latitude' => 28.6139,
            'birth_longitude' => 77.209,
            'birth_timezone' => 'Asia/Kolkata',
        ]);
    }
}
