<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $debugEnabled = config('app.debug');
        if ($debugEnabled) {
            
            $this->call([
                AttendanceSeeder::class,
            ]);

            $this->call([
                UserSeeder::class,
            ]);

            $this->call([
                EmployeeSeeder::class,
            ]);

        }
    }
}