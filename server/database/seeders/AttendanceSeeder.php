<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Attendance;

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
            [
                'employee_id' => 'EMP-0004',
                'name' => 'Rose Anne',
            ],
            [
                'employee_id' => 'EMP-0005',
                'name' => 'Anne',
            ],
            [
                'employee_id' => 'EMP-0006',
                'name' => 'Maye',
            ],
        ];

        $startDate = Carbon::create(null, 1, 1)->startOfDay();

        foreach ($employees as $employee) {
            for ($monthOffset = 0; $monthOffset < 3; $monthOffset++) {
                $currentMonthStart = $startDate->copy()->addMonths($monthOffset);

                for ($day = 0; $day < $currentMonthStart->daysInMonth; $day++) {
                    $date = $currentMonthStart->copy()->addDays($day);

                    if ($date->isWeekday()) {
                        $timeIn = $date->copy()->setTime(8, 0, 0);
                        $timeOut = $date->copy()->setTime(17, 0, 0);

                        Attendance::insert([
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
        }

        $this->command->info('3 months (January, February, March) of attendance records for weekdays (Monday to Friday) created successfully.');
    }
}
