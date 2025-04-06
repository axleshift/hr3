<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'role' => 'superAdmin',
                'username' => 'Joy',
                'name' => 'Mary Joy  Ayen',
                'email' => 'rosen@gmail.com',
                'password' => Hash::make('dandandan'),
            ],
            [
                'role' => 'admin',
                'username' => 'Maria',
                'name' => 'Maria Isabelle Cruz',
                'email' => 'mariacruz98@gmail.com',
                'password' => Hash::make('dandandan'),
            ],
            [
                'role' => 'staff',
                'username' => 'Angelo',
                'name' => 'Angelo Martin Santos',
                'email' => 'angelo.santos23@gmail.com',
                'password' => Hash::make('dandandan'),
            ],
            [
                'role' => 'employee',
                'username' => 'Benjamin',
                'name' => 'Benjamin Krane',
                'email' => 'ben@gmail.com',
                'password' => Hash::make('dandandan'),
            ],
            [
                'role' => 'employee',
                'username' => 'Anne',
                'name' => 'Rose Anne',
                'email' => 'anne@gmail.com',
                'password' => Hash::make('dandandan'),
            ],
            [
                'role' => 'employee',
                'username' => 'Maye',
                'name' => 'Maye',
                'email' => 'maye@gmail.com',
                'password' => Hash::make('dandandan'),
            ],
            
        ];

        foreach ($users as $user) {
            User::create($user);
        }

        $this->command->info('Successfully created users with different roles!');
    }
}
