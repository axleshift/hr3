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
                'username' => 'superAdmin',
                'name' => 'super admin',
                'email' => 'rosen@gmail.com',
                'password' => Hash::make('dandandan'),
            ],
            [
                'role' => 'admin',
                'username' => 'admin',
                'name' => 'Administrator',
                'email' => 'admin@gmail.com',
                'password' => Hash::make('dandandan'),
            ],
            [
                'role' => 'staff',
                'username' => 'staff',
                'name' => 'Staff',
                'email' => 'staff@gmail.com',
                'password' => Hash::make('dandandan'),
            ],
            [
                'role' => 'employee',
                'username' => 'employee',
                'name' => 'Employee',
                'email' => 'employee@gmail.com',
                'password' => Hash::make('dandandan'),
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }

        $this->command->info('Successfully created users with different roles!');
    }
}
