<?php

namespace App\Http\Controllers\API;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Employee;
use DateTime;

class AttendanceController extends Controller
{
    public function calculatePayroll(Request $request)
{
    // Get the year and month from the request (default to current month if not provided)
    $year = $request->input('year', date('Y'));
    $month = $request->input('month', date('m'));

    // Fetch attendance records for the specified month and year
    $attendances = Attendance::whereYear('date', $year)
        ->whereMonth('date', $month)
        ->get();

    $employeeMap = [];

    foreach ($attendances as $attendance) {
        $employeeId = $attendance->employee_id;

        if (!isset($employeeMap[$employeeId])) {
            $employeeMap[$employeeId] = [
                'employee_id' => $employeeId,
                'name' => $attendance->name,
                'total_worked_hours' => 0,
                'total_overtime' => 0,
            ];
        }

        // Calculate worked hours and overtime
        $workedHours = (strtotime($attendance->time_out) - strtotime($attendance->time_in)) / 3600;
        $overtime = max(0, $workedHours - 8);

        $employeeMap[$employeeId]['total_worked_hours'] += $workedHours;
        $employeeMap[$employeeId]['total_overtime'] += $overtime;
    }

    // Save the computed data to the employee_payrolls table
    foreach ($employeeMap as $employeeId => $data) {
        Payroll::updateOrCreate(
            ['employee_id' => $employeeId], // Find by employee_id
            [
                'total_worked_hours' => $data['total_worked_hours'],
                'total_overtime' => $data['total_overtime'],
            ]
        );
    }

    // Convert the associative array to an indexed array
    $payrollData = array_values($employeeMap);

    return response()->json($payrollData);
}


    

}