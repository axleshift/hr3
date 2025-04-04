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
                'employee_id' => 'EMP-0002',
                'name' => 'Benjamin Krane',
                'job_position' => 'Operations Manager',
                'department' => 'Logistics',
            ],
            [
                'employee_id' => 'EMP-0003',
                'name' => 'Alice Smith',
                'job_position' => 'Freight Coordinator',
                'department' => 'Operations',
            ],
            [
                'employee_id' => 'EMP-0004',
                'name' => 'Rose Anne',
                'job_position' => 'Billing Specialist',
                'department' => 'Finance',
            ],
            [
                'employee_id' => 'EMP-0005',
                'name' => 'Anne',
                'job_position' => 'HR Associate',
                'department' => 'Human Resources',
            ],
            [
                'employee_id' => 'EMP-0006',
                'name' => 'Maye',
                'job_position' => 'Driver',
                'department' => 'Transportation',
            ],
        ];

        foreach ($employees as $employee) {
            Employee::create([
                'employee_id' => $employee['employee_id'],
                'name' => $employee['name'],
                'job_position' => $employee['job_position'],
                'department' => $employee['department'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }

        $this->command->info('Employees seeded successfully.');
    }
}
