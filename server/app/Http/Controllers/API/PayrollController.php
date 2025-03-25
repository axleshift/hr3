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

class PayrollController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
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
            'base_salary' => 'required|numeric',
        ]);
    
        $payroll = Payroll::where('job_position', $request->job_position)->first();
    
        if ($payroll) {
            $payroll->update([
                'base_salary' => $request->base_salary,
            ]);
        } else {
            $payroll = Payroll::create([
                'job_position' => $request->job_position,
                'base_salary' => $request->base_salary,
            ]);
        }
    
        return response()->json([
            'message' => 'Payroll data saved successfully',
            'payroll' => $payroll,
        ], 201);
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


    public function calculate(Request $request)
    {
        $year = $request->input('year', date('Y'));
        $month = $request->input('month', date('m'));
    
        $attendances = Attendance::whereYear('date', $year)
            ->whereMonth('date', $month)
            ->get();
    
        $overtimeRate = Rate::where('type', 'overtime_rate')->first();
        $overtimeRateValue = $overtimeRate ? $overtimeRate->rate : 0;
    
        $benefits = Benefit::whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->get()
            ->groupBy('employee_id');
    
        $employeeMap = [];
    
        $standardHoursPerDay = 8;
        $lunchBreakHours = 1;
        $standardStartTime = strtotime('08:00:00');
        $standardEndTime = strtotime('17:00:00');
    
        foreach ($attendances as $attendance) {
            $employeeId = $attendance->employee_id;
    
            if (!isset($employeeMap[$employeeId])) {
                $existingPayroll = Payroll::where('employee_id', $employeeId)
                    ->where('year', $year)
                    ->where('month', $month)
                    ->first();
    
                $employee = Employee::where('employee_id', $employeeId)->first();
                $payroll = Payroll::where('job_position', $employee->job_position)->first();
                $baseSalary = $payroll ? $payroll->base_salary : 0;
    
                $user = User::where('employee_id', $employeeId)->first();
    
                $benefitsTotal = 0;
                if (isset($benefits[$employeeId])) {
                    $benefitsTotal = $benefits[$employeeId]->sum('amount');
                }


    
                $employeeMap[$employeeId] = [
                    'employee_id' => $employeeId,
                    'name' => $attendance->name,
                    'department' => $employee ? $employee->department : NULL,
                    'job_position' => $employee ? $employee->job_position : NULL,
                    'total_regular_hours' => 0,
                    'total_overtime_hours' => 0,
                    'total_late_hours' => 0,
                    'total_undertime_hours' => 0,
                    'bonus' => $existingPayroll ? $existingPayroll->bonus : 0,
                    'deduction' => $existingPayroll ? $existingPayroll->deduction : 0,
                    'net_salary' => 0,
                    'total_overtime_amount' => 0,
                    'base_salary' => $baseSalary,
                    'daily_rate' => 0,
                    'user_id' => $user ? $user->id : NULL,
                    'benefits_total' => $benefitsTotal,
                    'tax' => 0,
                ];
            }
            
            $timeIn = strtotime($attendance->time_in);
            $timeOut = strtotime($attendance->time_out);
    
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
    
        $payrollData = array_values($employeeMap);
    
        foreach ($payrollData as &$data) {
            $dailyRate = $data['base_salary'] / ($data['total_regular_hours'] ?: 1);
            $totalOvertimeAmount = $data['total_overtime_hours'] * $overtimeRateValue;
            $grossSalary = ($data['total_regular_hours'] * $dailyRate) + $totalOvertimeAmount;
            $tax = $this->calculateProgressiveTax($grossSalary);
            
            $netSalary = $grossSalary
                       + $data['bonus']
                       - $data['deduction']
                       - $tax
                       - $data['benefits_total'];
    
            $payrollDataToSave = [
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
                'year' => $year,
                'gross_salary' => $grossSalary,
                'month' => $month,
                'base_salary' => $data['base_salary'],
                'daily_rate' => $dailyRate,
                'user_id' => $data['user_id'],
                'benefits_total' => $data['benefits_total'],
                'tax' => $tax,
            ];
    
            Payroll::updateOrCreate(
                [
                    'employee_id' => $data['employee_id'],
                    'year' => $year,
                    'month' => $month,
                ],
                $payrollDataToSave
            );
        }
    
        $savedPayrollData = Payroll::where('year', $year)
            ->where('month', $month)
            ->get();
    
        return response()->json($savedPayrollData);
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
    
        $employees = User::where('role', 'employee')->get();
    
        if ($employees->isEmpty()) {
            return response()->json([
                'message' => 'No employees found.',
            ], 404);
        }
    
        foreach ($employees as $employee) {
            $payroll = Payroll::where('user_id', $employee->id)
                ->where('month', $selectedMonth)
                ->where('year', $selectedYear)
                ->first();
    
            if (!$payroll) {
                continue;
            }
    
            Payslip::create([
                'user_id' => $employee->id,
                'employee_id' => $employee->employee_id,
                'name' => $employee->name,
                'department' => $payroll->department,
                'job_position' => $payroll->job_position,
                'month' => $selectedMonth,
                'year' => $selectedYear,
                'net_salary' => $payroll->net_salary,
                'tax' => $payroll->tax,
                'benefits_total' => $payroll->benefits_total,
                'base_salary' => $payroll->base_salary,
                'bonus' => $payroll->bonus,
                'deduction' => $payroll->deduction,
                'total_overtime_amount' => $payroll->total_overtime_amount,
                'status' => 'Paid',
                'issued_at' => now(),
            ]);
        }
    
        return response()->json([
            'message' => 'Payslips released successfully for all employees!',
        ], 200);
    }
}
