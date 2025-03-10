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
            User::factory(100)->create();

            User::create([
                'name' => 'John',
                'email' => 'user@example.com',
                'username' => 'user',
                'password' => 'user'
            ]);

            User::create([
               'name' => 'Admin',
                'email' => 'admin@example.com',
                'username' => 'admin',
                'password' => 'admin'
            ]);
            
            $this->call([
                AttendanceSeeder::class,
            ]);

            // $this->call([
            //     EmployeeSeeder::class,
            // ]);
        }
    }
}