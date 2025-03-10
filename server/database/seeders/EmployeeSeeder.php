<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employees = [
            [
                'name' => 'Benjamin Krane',
                'employee_id' => 'EMP-0002',
                'job_position' => 'Developer',
                'department' => 'IT',
            ],
            [
                'name' => 'Olivia Vantari',
                'employee_id' => 'EMP-0003',
                'job_position' => 'Manager',
                'department' => 'HR',
            ],
            [
                'name' => 'Rose',
                'employee_id' => 'EMP-0004',
                'job_position' => 'Manager',
                'department' => 'HR',
            ],
        ];

        DB::table('employees')->insert($employees);
    }
}
