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
use Illuminate\Support\Facades\Log;
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

    // public function index(Request $request)
    // {
    //     $year = (int)$request->input('year', date('Y'));
    //     $month = (int)$request->input('month', date('m'));
    //     $calculate = filter_var($request->input('calculate', false), FILTER_VALIDATE_BOOLEAN);
    
    //     if ($calculate) {
    //         $this->calculatePayroll($year, $month);
    //     }
    
    //     $payrolls = Payroll::where('year', $year)
    //         ->where('month', $month)
    //         ->whereHas('employee', function($query) use ($year, $month) {
    //             $query->whereHas('attendances', function($q) use ($year, $month) {
    //                 $q->whereYear('date', $year)
    //                   ->whereMonth('date', $month);
    //             });
    //         })
    //         ->get()
    //         ->map(function ($payroll, $index) {
    //             $payroll->id = $index + 1;
    //             return $payroll;
    //         });
    
    //     return response()->json($payrolls);
    // }

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
        if (!checkdate($month, 1, $year)) {
            return;
        }
    
        $attendances = Attendance::with('employee')
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->get();
        
        if ($attendances->isEmpty()) {
            return;
        }
    
        $overtimeRate = Rate::where('name', 'overtime')->first();
        $overtimeRateValue = $overtimeRate ? $overtimeRate->rate : 0;
    
        $benefits = Benefit::whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->get()
            ->groupBy('employee_id');
    
        $employeeMap = [];
        $standardHoursPerDay = 8;
        $lunchBreakHours = 1;
        $standardStartTime = strtotime('08:00:00');
    
        foreach ($attendances as $attendance) {
            $employeeId = $attendance->employee_id;
    
            if (!isset($employeeMap[$employeeId])) {
                $employee = $attendance->employee ?? Employee::find($employeeId);
                
                if (!$employee) {
                    continue;
                }
    
                $existingPayroll = Payroll::firstOrNew([
                    'employee_id' => $employeeId,
                    'year' => $year,
                    'month' => $month
                ]);
    
                $baseSalary = optional(Payroll::where('job_position', $employee->job_position)
                    ->first())->base_salary ?? 0;
    
                $employeeMap[$employeeId] = [
                    'employee_id' => $employeeId,
                    'name' => $attendance->name,
                    'department' => $employee->department,
                    'job_position' => $employee->job_position,
                    'total_regular_hours' => 0,
                    'total_overtime_hours' => 0,
                    'total_late_hours' => 0,
                    'total_undertime_hours' => 0,
                    'bonus' => $existingPayroll->bonus ?? 0,
                    'deduction' => $existingPayroll->deduction ?? 0,
                    'base_salary' => $baseSalary,
                    'user_id' => $user->id ?? null,
                    'benefits_total' => isset($benefits[$employeeId]) ? $benefits[$employeeId]->sum('amount') : 0,
                ];
            }
    
            if (empty($attendance->time_in) || empty($attendance->time_out)) {
                continue;
            }
    
            $timeIn = strtotime($attendance->time_in);
            $timeOut = strtotime($attendance->time_out);
            
            if ($timeOut <= $timeIn) {
                continue;
            }
    
            if ($timeIn > $standardStartTime) {
                $lateHours = ($timeIn - $standardStartTime) / 3600;
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
        }
    
        foreach ($employeeMap as $employeeId => $data) {
            $dailyRate = $data['base_salary'] / 22;
            $hourlyRate = $dailyRate / $standardHoursPerDay;
            
            $totalOvertimeAmount = $data['total_overtime_hours'] * $overtimeRateValue;
            $regularPay = $data['total_regular_hours'] * $hourlyRate;
            $grossSalary = $regularPay + $totalOvertimeAmount;
            $tax = $this->calculateProgressiveTax($grossSalary);
            
            $netSalary = $grossSalary 
                       + $data['bonus']
                       - $data['deduction']
                       - $tax
                       - $data['benefits_total'];
    
            Payroll::updateOrCreate(
                [
                    'employee_id' => $employeeId,
                    'year' => $year,
                    'month' => $month,
                ],
                [
                    'name' => $data['name'],
                    'department' => $data['department'],
                    'job_position' => $data['job_position'],
                    'total_regular_hours' => $data['total_regular_hours'],
                    'total_overtime_hours' => $data['total_overtime_hours'],
                    'total_late_hours' => $data['total_late_hours'],
                    'total_undertime_hours' => $data['total_undertime_hours'],
                    'bonus' => $data['bonus'],
                    'deduction' => $data['deduction'],
                    'net_salary' => $netSalary,
                    'total_overtime_amount' => $totalOvertimeAmount,
                    'base_salary' => $data['base_salary'],
                    'daily_rate' => $dailyRate,
                    'hourly_rate' => $hourlyRate,
                    'user_id' => $data['user_id'],
                    'benefits_total' => $data['benefits_total'],
                    'tax' => $tax,
                    'gross_salary' => $grossSalary,
                    'status' => 'Pending'
                ]
            );
        }
    }
    
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


    /**
     * Get payroll data for a specific month/year
     */
    public function index(Request $request)
{
    // Manually handle boolean conversion
    $calculate = filter_var($request->input('calculate', false), FILTER_VALIDATE_BOOLEAN);
    
    $validated = $request->validate([
        'year' => 'sometimes|integer|min:2000|max:2100',
        'month' => 'sometimes|integer|min:1|max:12',
        // Remove boolean validation since we're handling it manually
    ]);

    $year = $validated['year'] ?? date('Y');
    $month = $validated['month'] ?? date('m');

    if ($calculate) {
        $this->calculatePayroll($year, $month);
    }

    $payrolls = Payroll::with(['employee', 'user'])
        ->where('year', $year)
        ->where('month', $month)
        ->orderBy('department')
        ->orderBy('name')
        ->get();

    return response()->json($payrolls);
}

}
