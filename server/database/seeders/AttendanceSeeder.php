<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Attendance;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

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
                'punctuality' => 0.9, // 90% on time
                'absent_chance' => 0.05, // 5% chance of absence
            ],
            [
                'employee_id' => 'EMP-0003',
                'name' => 'Rose Anne',
                'punctuality' => 0.8, // 80% on time
                'absent_chance' => 0.1, // 10% chance of absence
            ],
            [
                'employee_id' => 'EMP-0004',
                'name' => 'Maye',
                'punctuality' => 0.7, // 70% on time
                'absent_chance' => 0.15, // 15% chance of absence
            ],
        ];

        // Generate data for the last 3 months
        $startDate = Carbon::now()->subMonths(3)->startOfMonth();
        $endDate = Carbon::now()->subDay()->endOfDay();

        foreach ($employees as $employee) {
            $period = CarbonPeriod::create($startDate, $endDate);

            foreach ($period as $date) {
                // Skip weekends (Saturday and Sunday)
                if ($date->isWeekend()) {
                    continue;
                }

                // Random chance of absence
                if (mt_rand(1, 100) <= ($employee['absent_chance'] * 100)) {
                    continue;
                }

                // Base working hours (8:30 AM to 5:30 PM with 1 hour lunch)
                $baseTimeIn = $date->copy()->setTime(8, 30, 0);
                $baseTimeOut = $date->copy()->setTime(17, 30, 0);

                // Add randomness to time in (0-30 minutes early/late)
                $isPunctual = (mt_rand(1, 100) <= ($employee['punctuality'] * 100));
                $timeInVariation = $isPunctual 
                    ? mt_rand(-15, 5) // Mostly on time or slightly early
                    : mt_rand(15, 120); // Late by 15-120 minutes

                $timeIn = $baseTimeIn->copy()->addMinutes($timeInVariation);

                // Add randomness to time out (0-60 minutes early/late)
                $timeOutVariation = mt_rand(-30, 60);
                $timeOut = $baseTimeOut->copy()->addMinutes($timeOutVariation);

                // Ensure time out is after time in
                if ($timeOut <= $timeIn) {
                    $timeOut = $timeIn->copy()->addHours(8); // Minimum 8 hour workday
                }

                // Create attendance record
                Attendance::create([
                    'employee_id' => $employee['employee_id'],
                    'name' => $employee['name'],
                    'date' => $date->toDateString(),
                    'time_in' => $timeIn,
                    'time_out' => $timeOut,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->command->info('Realistic attendance records for 3 months created successfully.');
    }
}