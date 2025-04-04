<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payroll;
use App\Models\Salary;
use App\Models\Payslip;
use App\Models\LeaveRequest;
use App\Models\Benefit;
use App\Models\Rate;
use App\Models\Employee;
use App\Models\Attendance;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;


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

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'job_position' => 'required|string',
            'monthly_rate' => 'required|numeric|min:0',
            'department' => 'sometimes|string' // Added department field
        ]);

        // Update or create salary record
        Salary::updateOrCreate(
            ['job_position' => $request->job_position],
            [
                'monthly_rate' => $request->monthly_rate,
                'department' => $request->department ?? null
            ]
        );

        return response()->json([
            'message' => 'Base salary updated successfully',
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
    public function update(Request $request, $id)
    {
        $request->validate([
            'status' => 'sometimes|in:Paid,Pending',
            'payroll_status' => 'sometimes|in:pending,approved,rejected'
        ]);
    
        $payroll = Payroll::findOrFail($id);
        
        if ($request->has('status')) {
            $payroll->status = $request->status;
        }

        if ($request->has('payroll_status')) {
            $payroll->payroll_status = $request->payroll_status;
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

    /**
     * Download Report by department
     */
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
    
        // Check for existing payslips for this month/year (regardless of period)
        $existingPayslips = Payslip::where('month', $selectedMonth)
            ->where('year', $selectedYear)
            ->exists();
    
        if ($existingPayslips) {
            return response()->json([
                'message' => 'Payslips for this month/year have already been released.',
            ], 400);
        }
    
        // Get the most recent payroll records for this month/year
        $payrolls = Payroll::where('month', $selectedMonth)
            ->where('year', $selectedYear)
            ->orderBy('period', 'desc')
            ->get()
            ->unique('employee_id'); // Only take the most recent period for each employee
    
        if ($payrolls->isEmpty()) {
            return response()->json([
                'message' => 'No payroll records found for this period.',
                'count' => 0
            ], 200);
        }
    
        $createdCount = 0;
        foreach ($payrolls as $payroll) {
            Payslip::create([
                'user_id' => $payroll->user_id,
                'employee_id' => $payroll->employee_id,
                'name' => $payroll->name,
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
                'total_regular_hours' => $payroll->total_regular_hours,
                'total_overtime_hours' => $payroll->total_overtime_hours,
                'total_late_hours' => $payroll->total_late_hours,
                'total_undertime_hours' => $payroll->total_undertime_hours,
                'working_days' => $payroll->working_days,
                'daily_rate' => $payroll->daily_rate,
                'monthly_rate' => $payroll->monthly_rate,
                'gross_salary' => $payroll->gross_salary,
                'paid_leave_amount' => $payroll->paid_leave_amount,
                'start_date' => $payroll->start_date,
                'end_date' => $payroll->end_date,
                'status' => 'Sent',
                'issued_at' => now(),
            ]);
            $createdCount++;
        }
    
        return response()->json([
            'message' => 'Payslips released successfully!',
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
    
    public function getSalaries()
    {
        try {
            $salaries = Salary::all(['job_position', 'monthly_rate']);
            
            return response()->json([
                'success' => true,
                'data' => $salaries
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch salary data',
                'error' => $e->getMessage()
            ], 500);
        }
    }



    public function index(Request $request)
{
    try {
        $calculate = filter_var($request->input('calculate', false), FILTER_VALIDATE_BOOLEAN);
        
        if ($calculate) {
            $validated = $request->validate([
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
            ]);
            
            return $this->calculate($validated['start_date'], $validated['end_date']);
        }

        $payrolls = Payroll::with(['employee', 'user'])
            ->orderBy('department')
            ->orderBy('name')
            ->get();
        
        $payrolls->transform(function ($item, $key) {
            $item->display_id = $key + 1;
            return $item;
        });

        return response()->json($payrolls);
        
    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'error' => 'Validation failed',
            'messages' => $e->errors()
        ], 400);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Server error',
            'message' => $e->getMessage()
        ], 500);
    }
}

            
    
    private function calculate($startDate, $endDate)
    {
        if (!$startDate || !$endDate) {
            return response()->json(['error' => 'Date range is required'], 400);
        }
    
        $start = Carbon::parse($startDate);
        $end = Carbon::parse($endDate);
        $month = $start->month;
        $year = $start->year;
    
        if ($end->lt($start)) {
            return response()->json(['error' => 'End date must be after start date'], 400);
        }
    
        $existingPayrolls = Payroll::where('start_date', $start->format('Y-m-d'))
                            ->where('end_date', $end->format('Y-m-d'))
                            ->orderBy('period', 'desc')
                            ->get();
    
        $nextPeriod = 1;
        if ($existingPayrolls->isNotEmpty()) {
            $nextPeriod = $existingPayrolls->first()->period + 1;
        }

        $existingForThisPeriod = $existingPayrolls->firstWhere('period', $nextPeriod - 1);
        
        if ($existingForThisPeriod) {
            return response()->json([
                'message' => 'Payroll already calculated for this period',
                'data' => $existingPayrolls->where('period', $nextPeriod - 1)
            ], 200);
        }
    
    
        $employees = Employee::all();
        if ($employees->isEmpty()) {
            return response()->json(['error' => 'No employee data found'], 404);
        }
    
        $salaryData = Salary::all()->keyBy('job_position');
        if ($salaryData->isEmpty()) {
            return response()->json(['error' => 'No salary data configured'], 400);
        }
    
        $workingDays = 0;
        $current = clone $start;
        while ($current <= $end) {
            if (!$current->isWeekend()) {
                $workingDays++;
            }
            $current->addDay();
        }
    
        $attendances = Attendance::whereBetween('date', [
            $start->format('Y-m-d'),
            $end->format('Y-m-d')
        ])->get();
    
        if ($attendances->isEmpty()) {
            return response()->json(['error' => 'No attendance records found for this period'], 404);
        }
    
        $overtimeRate = Rate::where('name', 'overtime')->first();
        $overtimeRateValue = $overtimeRate ? $overtimeRate->rate : 0;
    
        $benefits = Benefit::whereBetween('created_at', [
            $start->startOfDay(),
            $end->endOfDay()
        ])->get()->groupBy('employee_id');
    
        $leaveRequests = LeaveRequest::where('status', 'Approved')
            ->where('is_paid', 'Paid')
            ->whereNotNull('paid_amount')
            ->where(function($query) use ($start, $end) {
                $query->where(function($q) use ($start, $end) {
                    $q->whereBetween('start_date', [$start->format('Y-m-d'), $end->format('Y-m-d')]);
                })->orWhere(function($q) use ($start, $end) {
                    $q->whereBetween('end_date', [$start->format('Y-m-d'), $end->format('Y-m-d')]);
                })->orWhere(function($q) use ($start, $end) {
                    $q->where('start_date', '<=', $start->format('Y-m-d'))
                      ->where('end_date', '>=', $end->format('Y-m-d'));
                });
            })
            ->get()
            ->groupBy(function($leave) {
                return strtolower(trim($leave->name));
            });
    
        $standardHoursPerDay = 8;
        $lunchBreakHours = 1;
        $gracePeriod = 15 * 60;
        $standardStartTime = strtotime('08:00:00');
        $lateThreshold = $standardStartTime + $gracePeriod;
    
        $employeeMap = [];
        foreach ($attendances as $attendance) {
            $employeeId = $attendance->employee_id;
            $employeeName = trim($attendance->employee->name ?? '');
        
            if (empty($employeeName)) {
                continue;
            }
    
            $employee = $employees->first(function ($emp) use ($employeeName) {
                return strtolower(trim($emp->name)) === strtolower($employeeName);
            });
    
            if (!$employee) {
                continue;
            }
            $user = User::whereRaw('LOWER(TRIM(name)) = ?', [strtolower(trim($employeeName))])->first();
            $userId = $user ? $user->id : null;
    
            $employeeId = $employee->employee_id;
            $jobPosition = $employee->job_position ?? null;
            
            if (!isset($employeeMap[$employeeId])) {
                $monthlyRate = $salaryData[$jobPosition]->monthly_rate ?? 0;
                $baseSalary = $monthlyRate / 2;
    
                $normalizedName = strtolower(trim($employeeName));
                $paidLeaveAmount = isset($leaveRequests[$normalizedName]) 
                    ? $leaveRequests[$normalizedName]->sum('paid_amount')
                    : 0;
    
                $employeeMap[$employeeId] = [
                    'employee_id' => $employeeId,
                    'user_id' => $userId ?? null,
                    'name' => $employeeName,
                    'department' => $employee->department ?? null,
                    'job_position' => $jobPosition,
                    'monthly_rate' => $monthlyRate,
                    'base_salary' => $baseSalary,
                    'total_regular_hours' => 0,
                    'total_overtime_hours' => 0,
                    'total_late_hours' => 0,
                    'total_undertime_hours' => 0,
                    'days_worked' => 0,
                    'paid_leave_amount' => $paidLeaveAmount,
                    'bonus' => 0,
                    'net_salary' => 0,
                    'total_overtime_amount' => 0,
                    'daily_rate' => 0,
                    'benefits_total' => isset($benefits[$employeeId]) ? $benefits[$employeeId]->sum('amount') : 0,
                    'tax' => 0,
                    'start_date' => $start->format('Y-m-d'),
                    'end_date' => $end->format('Y-m-d'),
                    'working_days' => $workingDays,
                ];
            }
    
            $timeIn = strtotime($attendance->time_in);
            $timeOut = strtotime($attendance->time_out);
            
            if ($timeOut <= $timeIn) {
                continue;
            }
    
            if ($timeIn >= $standardStartTime && $timeIn <= $lateThreshold) {
                $timeIn = $standardStartTime;
            }
    
            if ($timeIn > $lateThreshold) {
                $lateHours = ($timeIn - $lateThreshold) / 3600;
                $employeeMap[$employeeId]['total_late_hours'] += $lateHours;
            }
    
            $totalHoursWorked = max(0, ($timeOut - $timeIn) / 3600);
            $actualHoursWorked = $totalHoursWorked - $lunchBreakHours;
    
            $regularHours = min($actualHoursWorked, $standardHoursPerDay);
            $overtimeHours = max(0, $actualHoursWorked - $standardHoursPerDay);
            $undertimeHours = max(0, $standardHoursPerDay - $actualHoursWorked);
    
            $employeeMap[$employeeId]['total_regular_hours'] += $regularHours;
            $employeeMap[$employeeId]['total_overtime_hours'] += $overtimeHours;
            $employeeMap[$employeeId]['total_undertime_hours'] += $undertimeHours;
            $employeeMap[$employeeId]['days_worked'] += 1;
        }
    
        $payrollData = [];
        foreach ($employeeMap as $employeeId => $data) {
            if ($data['days_worked'] > 0) {
                $dailyRate = $data['base_salary'] / $data['working_days'];
                $totalOvertimeAmount = $data['total_overtime_hours'] * $overtimeRateValue;
                $grossSalary = ($data['working_days'] * $dailyRate) + $totalOvertimeAmount;
                $tax = $this->calculateProgressiveTax($grossSalary);
                
                $netSalary = $grossSalary
                    + ($data['bonus'] ?? 0)
                    - $tax
                    - ($data['benefits_total'] ?? 0)
                    - ($data['total_late_hours'] * $dailyRate / $standardHoursPerDay)
                    + ($data['paid_leave_amount'] ?? 0);
    
                $payrollData[] = [
                    'employee_id' => $employeeId,
                    'user_id' => $data['user_id'],
                    'name' => $data['name'],
                    'department' => $data['department'],
                    'job_position' => $data['job_position'],
                    'monthly_rate' => $data['monthly_rate'],
                    'base_salary' => $data['base_salary'],
                    'total_regular_hours' => $data['total_regular_hours'],
                    'total_overtime_hours' => $data['total_overtime_hours'],
                    'total_late_hours' => $data['total_late_hours'],
                    'total_undertime_hours' => $data['total_undertime_hours'],
                    'working_days' => $data['working_days'],
                    'bonus' => $data['bonus'],
                    'net_salary' => $netSalary,
                    'total_overtime_amount' => $totalOvertimeAmount,
                    'daily_rate' => $dailyRate,
                    'benefits_total' => $data['benefits_total'],
                    'tax' => $tax,
                    'paid_leave_amount' => $data['paid_leave_amount'],
                    'gross_salary' => $grossSalary,
                    'start_date' => $data['start_date'],
                    'end_date' => $data['end_date'],
                    'status' => 'Pending',
                    'month' => (int)$month,
                    'year' => (int)$year,
                    'period' => $nextPeriod,
                    'created_at' => now(),
                ];
            }
        }
    
        if (!empty($payrollData)) {
            Payroll::insert($payrollData);
        }
    
        return response()->json(
            Payroll::where('start_date', $start->format('Y-m-d'))
                ->where('end_date', $end->format('Y-m-d'))
                ->where('period', $nextPeriod)
                ->get()
        );
    }


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
    
    
}
