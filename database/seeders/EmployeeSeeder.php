<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employee;
use Illuminate\Support\Carbon;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employees = [
            [
                'employeeId' => 'EMP0002',
                'name' => 'Benjamin Krane',
                'position' => 'Operations Manager',
                'department' => 'Logistics',
            ],
            [
                'employeeId' => 'EMP0003',
                'name' => 'Rose Anne',
                'position' => 'Billing Specialist',
                'department' => 'Finance',
            ],
            [
                'employeeId' => 'EMP0004',
                'name' => 'Maye',
                'position' => 'HR Associate',
                'department' => 'Human Resources',
            ],
        ];

        foreach ($employees as $employee) {
            Employee::create([
                'employeeId' => $employee['employeeId'],
                'name' => $employee['name'],
                'position' => $employee['position'],
                'department' => $employee['department'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }

        $this->command->info('Employees seeded successfully.');
    }
}
