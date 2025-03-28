<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payroll;
use App\Models\User;
use App\Models\Payslip;
use App\Models\Employee;
use App\Models\Benefit;
use App\Models\Rate;
use App\Models\Attendance;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class PayrollController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function all()
    {
         $payrolls = Payroll::all();
         return response()->json($payrolls);
    }

    public function index(Request $request)
    {
        $year = (int)$request->input('year', date('Y'));
        $month = (int)$request->input('month', date('m'));
        $calculate = filter_var($request->input('calculate', false), FILTER_VALIDATE_BOOLEAN);
    
        if ($calculate) {
            $this->calculatePayroll($year, $month);
        }
    
        $payrolls = Payroll::where('year', $year)
            ->where('month', $month)
            ->whereHas('employee', function($query) use ($year, $month) {
                $query->whereHas('attendances', function($q) use ($year, $month) {
                    $q->whereYear('date', $year)
                      ->whereMonth('date', $month);
                });
            })
            ->get()
            ->map(function ($payroll, $index) {
                $payroll->id = $index + 1;
                return $payroll;
            });
    
        return response()->json($payrolls);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'job_position' => 'required|string',
            'base_salary' => 'required|numeric',
        ]);
    
        Payroll::where('job_position', $request->job_position)
            ->update(['base_salary' => $request->base_salary]);
    
        return response()->json([
            'message' => 'Base salary updated for all employees with this job position',
        ], 200); 
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $payroll = Payroll::find($id);

        if (!$payroll) {
            return response()->json([
                'message' => 'Payroll record not found'
            ], 404);
        }
        return response()->json($payroll);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'status' => 'sometimes|in:Paid,Pending',
        ]);
    
        $payroll = Payroll::findOrFail($id);
        if ($request->has('status')) {
            $payroll->status = $request->status;
        }
    
        $payroll->save();
        return response()->json([
            'message' => 'Payroll status updated successfully',
            'data' => $payroll
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    private function calculatePayroll($year, $month)
    {
        // Fetch attendance with employee data
        $employeesWithAttendance = Attendance::whereYear('date', $year)
            ->whereMonth('date', $month)
            ->with('employee')
            ->get()
            ->groupBy('employee_id');
    
        if ($employeesWithAttendance->isEmpty()) {
            Log::info("No attendance records found for {$month}/{$year}");
            return;
        }
    
        // Get base salary rates by position
        $jobPositions = Payroll::select('job_position', 'base_salary')
            ->distinct()
            ->get()
            ->mapWithKeys(fn ($item) => [$item->job_position => $item->base_salary]);
    
        // Get overtime rate
        $overtimeRate = Rate::where('name', 'overtime')->first();
        $overtimeRateValue = $overtimeRate ? $overtimeRate->rate : 0;
    
        // Get benefits for the period
        $benefits = Benefit::whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->get()
            ->groupBy('employee_id');
    
        foreach ($employeesWithAttendance as $employeeId => $attendances) {
            // Skip if no employee record
            if (!$attendances->first()->employee) {
                Log::warning("No employee record for attendance with employee_id: {$employeeId}");
                continue;
            }
    
            $employee = $attendances->first()->employee;
            
            // Initialize counters
            $totalRegularHours = 0;
            $totalOvertimeHours = 0;
            $totalLateHours = 0;
            $totalUndertimeHours = 0;
            $workingDays = 0;
    
            foreach ($attendances as $attendance) {
                // Skip incomplete records
                if (empty($attendance->time_in) || empty($attendance->time_out)) {
                    continue;
                }
    
                try {
                    // Parse times
                    $timeIn = Carbon::parse($attendance->time_in);
                    $timeOut = Carbon::parse($attendance->time_out);
                    
                    // Skip if time out is before time in (invalid)
                    if ($timeOut->lt($timeIn)) {
                        Log::warning("Invalid time range for employee {$employeeId} on {$attendance->date}");
                        continue;
                    }
    
                    $workingDays++;
                    $standardStart = Carbon::parse('08:00:00');
                    $standardEnd = Carbon::parse('17:00:00'); // 8 hours + 1 hour lunch
                    $lunchBreakHours = 1;
                    $standardHoursPerDay = 8;
    
                    // Calculate late hours
                    if ($timeIn->gt($standardStart)) {
                        $lateHours = $timeIn->diffInHours($standardStart);
                        $totalLateHours += min($lateHours, $standardHoursPerDay); // Cap at standard hours
                    }
    
                    // Calculate total worked hours (subtract lunch break)
                    $totalHoursWorked = $timeOut->diffInHours($timeIn) - $lunchBreakHours;
                    $actualHoursWorked = max(0, $totalHoursWorked); // Ensure not negative
    
                    // Calculate regular, overtime, and undertime
                    $regularHours = min($actualHoursWorked, $standardHoursPerDay);
                    $overtimeHours = max(0, $actualHoursWorked - $standardHoursPerDay);
                    $undertimeHours = max(0, $standardHoursPerDay - $actualHoursWorked);
    
                    $totalRegularHours += $regularHours;
                    $totalOvertimeHours += $overtimeHours;
                    $totalUndertimeHours += $undertimeHours;
    
                } catch (\Exception $e) {
                    Log::error("Error processing attendance for employee {$employeeId}: " . $e->getMessage());
                    continue;
                }
            }
    
            // Skip if no valid attendance records
            if ($workingDays === 0) {
                continue;
            }
    
            // Get existing payroll or create new
            $existingPayroll = Payroll::firstOrNew([
                'employee_id' => $employeeId,
                'year' => $year,
                'month' => $month,
            ]);
    
            // Calculate salary components
            $baseSalary = $jobPositions[$employee->job_position] ?? 0;
            $dailyRate = $workingDays > 0 ? $baseSalary / 22 : 0; // 22 working days/month
            $hourlyRate = $dailyRate / 8;
    
            // Find associated user
            $user = User::where('name', $employee->name)->first();
            
            // Calculate compensation
            $totalOvertimeAmount = $totalOvertimeHours * $overtimeRateValue;
            $benefitsTotal = $benefits[$employeeId]->sum('amount') ?? 0;
            $grossSalary = $baseSalary + $totalOvertimeAmount;
            $tax = $this->calculateProgressiveTax($grossSalary);
            $netSalary = $grossSalary + ($existingPayroll->bonus ?? 0) - $tax - $benefitsTotal;
    
            // Update or create payroll record
            $existingPayroll->fill([
                'name' => $employee->name,
                'department' => $employee->department,
                'job_position' => $employee->job_position,
                'total_regular_hours' => $totalRegularHours,
                'total_overtime_hours' => $totalOvertimeHours,
                'total_late_hours' => $totalLateHours,
                'total_undertime_hours' => $totalUndertimeHours,
                'bonus' => $existingPayroll->bonus ?? 0,
                'net_salary' => $netSalary,
                'total_overtime_amount' => $totalOvertimeAmount,
                'base_salary' => $baseSalary,
                'daily_rate' => $dailyRate,
                'benefits_total' => $benefitsTotal,
                'tax' => $tax,
                'gross_salary' => $grossSalary,
                'status' => $existingPayroll->status ?: 'Pending',
                'user_id' => $user->id ?? null,
            ])->save();
        }
    }

    // private function calculatePayroll($year, $month)
    // {
    //     $employeesWithAttendance = Attendance::whereYear('date', $year)
    //         ->whereMonth('date', $month)
    //         ->with('employee')
    //         ->get()
    //         ->groupBy('employee_id');
    
    //     if ($employeesWithAttendance->isEmpty()) {
    //         return;
    //     }
    
    //     $jobPositions = Payroll::select('job_position', 'base_salary')
    //         ->distinct()
    //         ->get()
    //         ->mapWithKeys(function ($item) {
    //             return [$item->job_position => $item->base_salary];
    //         });
    
    //     $overtimeRate = Rate::where('name', 'overtime')->first();
    //     $overtimeRateValue = $overtimeRate ? $overtimeRate->rate : 0;
    
    //     $benefits = Benefit::whereYear('created_at', $year)
    //         ->whereMonth('created_at', $month)
    //         ->get()
    //         ->groupBy('employee_id');
    
    //     foreach ($employeesWithAttendance as $employeeId => $attendances) {
    //         if (!$attendances->first()->employee) {
    //             Log::warning("No employee record found for attendance with employee_id: {$employeeId}");
    //             continue;
    //         }
    
    //         $employee = $attendances->first()->employee;
            
    //         $totalRegularHours = 0;
    //         $totalOvertimeHours = 0;
    //         $totalLateHours = 0;
    //         $totalUndertimeHours = 0;
    
    //         foreach ($attendances as $attendance) {
    //             if (!$attendance->time_in || !$attendance->time_out) {
    //                 continue;
    //             }
    
    //             $timeIn = strtotime($attendance->time_in);
    //             $timeOut = strtotime($attendance->time_out);
    //             $standardStartTime = strtotime('08:00:00');
    //             $standardHoursPerDay = 8;
    //             $lunchBreakHours = 1;
    
    //             if ($timeIn > $standardStartTime) {
    //                 $lateHours = ($timeIn - $standardStartTime) / 3600;
    //                 $totalLateHours += $lateHours;
    //             }
    
    //             $totalHoursWorked = max(0, ($timeOut - $timeIn) / 3600);
    //             $actualHoursWorked = $totalHoursWorked - $lunchBreakHours;
    
    //             $regularHours = min($actualHoursWorked, $standardHoursPerDay);
    //             $overtimeHours = max(0, $actualHoursWorked - $standardHoursPerDay);
    //             $undertimeHours = max(0, $standardHoursPerDay - $actualHoursWorked);
    
    //             $totalRegularHours += $regularHours;
    //             $totalOvertimeHours += $overtimeHours;
    //             $totalUndertimeHours += $undertimeHours;
    //         }
    
    //         $existingPayroll = Payroll::where('employee_id', $employeeId)
    //             ->where('year', $year)
    //             ->where('month', $month)
    //             ->first();
    
    //         // Use default base salary if job position not found
    //         $baseSalary = $jobPositions[$employee->job_position] ?? 0;
    //         $dailyRate = $baseSalary / 22;
    //         $hourlyRate = $dailyRate / 8;
    
    //         $user = User::where('name', $employee->name)->first();
    //         $userId = $user ? $user->id : null;
    
    //         $totalOvertimeAmount = $totalOvertimeHours * $overtimeRateValue;
    //         $benefitsTotal = isset($benefits[$employeeId]) ? $benefits[$employeeId]->sum('amount') : 0;
    
    //         $grossSalary = $baseSalary + $totalOvertimeAmount;
    //         $tax = $this->calculateProgressiveTax($grossSalary);
    
    //         $netSalary = $grossSalary 
    //                    + ($existingPayroll->bonus ?? 0)
    //                    - $tax
    //                    - $benefitsTotal;
    
    //         Payroll::updateOrCreate(
    //             [
    //                 'employee_id' => $employeeId,
    //                 'year' => $year,
    //                 'month' => $month,
    //             ],
    //             [
    //                 'name' => $employee->name,
    //                 'department' => $employee->department,
    //                 'job_position' => $employee->job_position,
    //                 'total_regular_hours' => $totalRegularHours,
    //                 'total_overtime_hours' => $totalOvertimeHours,
    //                 'total_late_hours' => $totalLateHours,
    //                 'total_undertime_hours' => $totalUndertimeHours,
    //                 'bonus' => $existingPayroll->bonus ?? 0,
    //                 'net_salary' => $netSalary,
    //                 'total_overtime_amount' => $totalOvertimeAmount,
    //                 'base_salary' => $baseSalary,
    //                 'daily_rate' => $dailyRate,
    //                 'benefits_total' => $benefitsTotal,
    //                 'tax' => $tax,
    //                 'gross_salary' => $grossSalary,
    //                 'status' => $existingPayroll ? $existingPayroll->status : 'Pending',
    //                 'user_id' => $userId,
    //             ]
    //         );
    //     }
    // }

    // private function calculatePayroll($year, $month)
    // {
    //     $employeesWithAttendance = Attendance::whereYear('date', $year)
    //     ->whereMonth('date', $month)
    //     ->with('employee') // Eager load employee relationship
    //     ->get()
    //     ->groupBy('employee_id');

    // if ($employeesWithAttendance->isEmpty()) {
    //     return;
    // }
    //     $jobPositions = Payroll::select('job_position', 'base_salary')
    //         ->distinct()
    //         ->get()
    //         ->mapWithKeys(function ($item) {
    //             return [$item->job_position => $item->base_salary];
    //         });
    
    //     $employees = Employee::all();
    
    //     $overtimeRate = Rate::where('type', 'overtime_rate')->first();
    //     $overtimeRateValue = $overtimeRate ? $overtimeRate->rate : 0;
    
    //     $benefits = Benefit::whereYear('created_at', $year)
    //         ->whereMonth('created_at', $month)
    //         ->get()
    //         ->groupBy('employee_id');
    
    //     $attendances = Attendance::whereYear('date', $year)
    //         ->whereMonth('date', $month)
    //         ->get()
    //         ->groupBy('employee_id');
    
    //     foreach ($employees as $employee) {
    //         $employeeId = $employee->employee_id;
            
    //         $totalRegularHours = 0;
    //         $totalOvertimeHours = 0;
    //         $totalLateHours = 0;
    //         $totalUndertimeHours = 0;
    
    //         if (isset($attendances[$employeeId])) {
    //             foreach ($attendances[$employeeId] as $attendance) {
    //                 $timeIn = strtotime($attendance->time_in);
    //                 $timeOut = strtotime($attendance->time_out);
    //                 $standardStartTime = strtotime('08:00:00');
    //                 $standardHoursPerDay = 8;
    //                 $lunchBreakHours = 1;
    
    //                 if ($timeIn > $standardStartTime) {
    //                     $lateHours = ($timeIn - $standardStartTime) / 3600;
    //                     $totalLateHours += $lateHours;
    //                 }
    
    //                 $totalHoursWorked = max(0, ($timeOut - $timeIn) / 3600);
    //                 $actualHoursWorked = $totalHoursWorked - $lunchBreakHours;
    //                 $regularHours = min($actualHoursWorked, $standardHoursPerDay);
    //                 $overtimeHours = max(0, $actualHoursWorked - $standardHoursPerDay);
    //                 $undertimeHours = max(0, $standardHoursPerDay - $actualHoursWorked);
    
    //                 $totalRegularHours += $regularHours;
    //                 $totalOvertimeHours += $overtimeHours;
    //                 $totalUndertimeHours += $undertimeHours;
    //             }
    //         }
    
    //         $existingPayroll = Payroll::where('employee_id', $employeeId)
    //             ->where('year', $year)
    //             ->where('month', $month)
    //             ->first();
    
    //         $baseSalary = $jobPositions[$employee->job_position] ?? 0;
    //         $dailyRate = $baseSalary / 22;
    //         $hourlyRate = $dailyRate / 8;
            
    //         $user = User::where('name', $employee->name)->first();
    //             $userId = $user ? $user->id : null;

    //         $totalOvertimeAmount = $totalOvertimeHours * $overtimeRateValue;
    //         $benefitsTotal = isset($benefits[$employeeId]) ? $benefits[$employeeId]->sum('amount') : 0;
            
    //         $grossSalary = $baseSalary + $totalOvertimeAmount;
    //         $tax = $this->calculateProgressiveTax($grossSalary);
            
    //         $netSalary = $grossSalary 
    //                    + ($existingPayroll->bonus ?? 0)
    //                    - $tax
    //                    - $benefitsTotal;
    
    //         Payroll::updateOrCreate(
    //             [
    //                 'employee_id' => $employeeId,
    //                 'year' => $year,
    //                 'month' => $month,
    //             ],
    //             [
    //                 'name' => $employee->name,
    //                 'department' => $employee->department,
    //                 'job_position' => $employee->job_position,
    //                 'total_regular_hours' => $totalRegularHours,
    //                 'total_overtime_hours' => $totalOvertimeHours,
    //                 'total_late_hours' => $totalLateHours,
    //                 'total_undertime_hours' => $totalUndertimeHours,
    //                 'bonus' => $existingPayroll->bonus ?? 0,
    //                 'net_salary' => $netSalary,
    //                 'total_overtime_amount' => $totalOvertimeAmount,
    //                 'base_salary' => $baseSalary,
    //                 'daily_rate' => $dailyRate,
    //                 'benefits_total' => $benefitsTotal,
    //                 'tax' => $tax,
    //                 'gross_salary' => $grossSalary,
    //                 'status' => $existingPayroll ? $existingPayroll->status : 'Pending',
    //                 'user_id' => $userId,
    //             ]
    //         );
    //     }
    // }
    
    /**
     * Calculate progressive tax based on Philippine tax brackets
     */
    private function calculateProgressiveTax(float $monthlySalary): float
    {
        if ($monthlySalary <= 20833) {
            return 0.00;
        } elseif ($monthlySalary <= 33332) {
            return 0.00 + (($monthlySalary - 20833) * 0.15);
        } elseif ($monthlySalary <= 66666) {
            return 1875.00 + (($monthlySalary - 33333) * 0.20);
        } elseif ($monthlySalary <= 166666) {
            return 8541.80 + (($monthlySalary - 66667) * 0.25);
        } elseif ($monthlySalary <= 666666) {
            return 33541.80 + (($monthlySalary - 166667) * 0.30);
        } else {
            return 183541.80 + (($monthlySalary - 666667) * 0.35);
        }
    }

    public function downloadReport(Request $request)
    {
        $year = $request->input('year');
        $month = $request->input('month');

        $payrollData = Payroll::where('year', $year)
            ->where('month', $month)
            ->get()
            ->groupBy('department');
    
        if ($payrollData->isEmpty()) {
            return response()->json(['message' => 'No payroll data found.'], 404);
        }
    
        $data = [
            'payrollData' => $payrollData,
            'year' => $year,
            'month' => $month,
        ];
    
        $pdf = Pdf::loadView('payroll.report', $data);
        return $pdf->download("payroll-report-{$year}-{$month}.pdf");
    }


    public function releasePayslips(Request $request)
    {
        $selectedMonth = $request->input('month');
        $selectedYear = $request->input('year');
    
        if (!$selectedMonth || !$selectedYear) {
            return response()->json([
                'message' => 'Month and year are required.',
            ], 400);
        }
    
        $existingPayslips = Payslip::where('month', $selectedMonth)
            ->where('year', $selectedYear)
            ->exists();
    
        if ($existingPayslips) {
            return response()->json([
                'message' => 'All payslips for this month have already been released.',
            ], 200);
        }
    
        $paidPayrolls = Payroll::where('status', 'Paid')
            ->where('month', $selectedMonth)
            ->where('year', $selectedYear)
            ->with('user')
            ->get();
    
        if ($paidPayrolls->isEmpty()) {
            return response()->json([
                'message' => 'No payroll records with Paid status found for this period.',
                'count' => 0
            ], 200);
        }
    
        $createdCount = 0;
        foreach ($paidPayrolls as $payroll) {
            Payslip::create([
                'user_id' => $payroll->user_id,
                'employee_id' => $payroll->employee_id,
                'name' => $payroll->user->name,
                'department' => $payroll->department,
                'job_position' => $payroll->job_position,
                'month' => $selectedMonth,
                'year' => $selectedYear,
                'net_salary' => $payroll->net_salary,
                'tax' => $payroll->tax,
                'benefits_total' => $payroll->benefits_total,
                'base_salary' => $payroll->base_salary,
                'bonus' => $payroll->bonus,
                'total_overtime_amount' => $payroll->total_overtime_amount,
                'status' => 'Paid',
                'issued_at' => now(),
            ]);
            $createdCount++;
        }
    
        return response()->json([
            'message' => 'Payslips released successfully for employees with Paid status!',
            'count' => $createdCount
        ], 200);
    }

    /**
     * Save bonus for all employees in a specific month/year
     */
    public function save(Request $request)
    {
        $request->validate([
                'year' => 'required|integer',
                'month' => 'required|integer',
                'bonus' => 'required|numeric',
            ]);
        
            $year = $request->input('year');
            $month = $request->input('month');
            $bonus = $request->input('bonus');
        
            $payrollRecords = Payroll::where('year', $year)
                ->where('month', $month)
                ->get();
        
            foreach ($payrollRecords as $payroll) {
                $payroll->bonus = $bonus;
                $payroll->net_salary = ($payroll->total_regular_hours * $payroll->salary_rate) +
                                        ($payroll->total_overtime_hours * $payroll->overtime_rate)
                                         +
                                        $bonus;
                $payroll->save();
            }
            return response()->json(['message' => ' bonus saved successfully']);
        }
        

    /**
     * Get the current bonus amount for a specific month/year
     */
    public function getBonus(Request $request)
    {
        $request->validate([
            'year' => 'required|integer',
            'month' => 'required|integer|between:1,12',
        ]);

        $year = $request->input('year');
        $month = $request->input('month');

        $payroll = Payroll::where('year', $year)
            ->where('month', $month)
            ->first();

        return response()->json([
            'bonus' => $payroll ? $payroll->bonus : 0
        ]);
    }
}
