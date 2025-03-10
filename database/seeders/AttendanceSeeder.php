<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
{
    $employees = [
        [
            'employee_id' => 'EMP-0002',
            'name' => 'Benjamin Krane',
        ],
        [
            'employee_id' => 'EMP-0003',
            'name' => 'Alice Smith',
        ],
    ];

    $startDate = Carbon::now()->subMonth()->startOfMonth()->startOfDay();

    foreach ($employees as $employee) {
        for ($monthOffset = 0; $monthOffset < 2; $monthOffset++) {
            // Calculate the start date for the current iteration
            $currentMonthStart = $startDate->copy()->addMonths($monthOffset);

            for ($day = 0; $day < $currentMonthStart->daysInMonth; $day++) {
                $date = $currentMonthStart->copy()->addDays($day);

                $timeIn = $date->copy()->setTime(8, 0, 0);
                $timeOut = $date->copy()->setTime(17, 0, 0);

                DB::table('attendances')->insert([
                    'employee_id' => $employee['employee_id'],
                    'name' => $employee['name'],
                    'date' => $date->toDateString(),
                    'time_in' => $timeIn->toDateTimeString(),
                    'time_out' => $timeOut->toDateTimeString(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    $this->command->info('2 months of attendance records for multiple employees created successfully.');
    }
}
