<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Payroll;
use App\Models\Employee;
use App\Models\Rate;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Barryvdh\DomPDF\Facade\Pdf;

class PayrollController extends Controller
{
    public function show($id)
    {
        $payroll = Payroll::find($id);

        if (!$payroll) {
            return response()->json(['message' => 'Payroll record not found'], 404);
        }
        return response()->json($payroll);
    }

    public function update(Request $request, $id)
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

    public function saveDeductionBonus(Request $request)
    {
        $request->validate([
            'year' => 'required|integer',
            'month' => 'required|integer',
            'deduction' => 'required|numeric',
            'bonus' => 'required|numeric',
        ]);

        $year = $request->input('year');
        $month = $request->input('month');
        $deduction = $request->input('deduction');
        $bonus = $request->input('bonus');

        $payrollRecords = Payroll::where('year', $year)
            ->where('month', $month)
            ->get();

        foreach ($payrollRecords as $payroll) {
            $payroll->deduction = $deduction;
            $payroll->bonus = $bonus;
            $payroll->net_salary = ($payroll->total_regular_hours * $payroll->salary_rate) +
                                    ($payroll->total_overtime_hours * $payroll->overtime_rate) -
                                    $deduction +
                                    $bonus;
            $payroll->save();
        }
        return response()->json(['message' => 'Deduction and bonus saved successfully']);
    }

    public function getRates()
    {
        $salaryRate = Rate::where('type', 'salary_rate')->first();
        $overtimeRate = Rate::where('type', 'overtime_rate')->first();

        return response()->json([
            'salary_rate' => $salaryRate ? $salaryRate->rate : null,
            'overtime_rate' => $overtimeRate ? $overtimeRate->rate : null,
        ]);
    }
    
    public function storeRates(Request $request)
    {
        $validated = $request->validate([
            'salary_rate' => 'required|numeric|min:0',
            'overtime_rate' => 'required|numeric|min:0',
        ]);
    
        Rate::updateOrCreate(
            ['type' => 'salary_rate'],
            ['rate' => $validated['salary_rate']]
        );
    
        Rate::updateOrCreate(
            ['type' => 'overtime_rate'],
            ['rate' => $validated['overtime_rate']]
        );
        return response()->json(['message' => 'Rates saved successfully'], 201);
    }

    public function calculate(Request $request)
    {
        $year = $request->input('year', date('Y'));
        $month = $request->input('month', date('m'));
    
        $attendances = Attendance::whereYear('date', $year)
            ->whereMonth('date', $month)
            ->get();
    
        $salaryRate = Rate::where('type', 'salary_rate')->first();
        $overtimeRate = Rate::where('type', 'overtime_rate')->first();
    
        $salaryRateValue = $salaryRate ? $salaryRate->rate : 0;
        $overtimeRateValue = $overtimeRate ? $overtimeRate->rate : 0;
    
        $employeeMap = [];
    
        $standardHoursPerDay = 8;
        $standardStartTime = strtotime('08:00:00');
        $standardEndTime = strtotime('17:00:00');
    
        foreach ($attendances as $attendance) {
            $employeeId = $attendance->employee_id;
    
            if (!isset($employeeMap[$employeeId])) {
                $existingPayroll = Payroll::where('employee_id', $employeeId)
                    ->where('year', $year)
                    ->where('month', $month)
                    ->first();
    
                $employeeMap[$employeeId] = [
                    'employee_id' => $employeeId,
                    'name' => $attendance->name,
                    'total_regular_hours' => 0,
                    'total_overtime_hours' => 0,
                    'total_late_hours' => 0,
                    'total_undertime_hours' => 0,
                    'deduction' => $existingPayroll ? $existingPayroll->deduction : 0,
                    'bonus' => $existingPayroll ? $existingPayroll->bonus : 0,
                    'net_salary' => 0,
                    'total_overtime_amount' => 0,
                ];
            }
    
            $timeIn = strtotime($attendance->time_in);
            $timeOut = strtotime($attendance->time_out);
    
            if ($timeIn > $standardStartTime) {
                $lateHours = ($timeIn - $standardStartTime) / 3600;
                $employeeMap[$employeeId]['total_late_hours'] += $lateHours;
            }
    
            if ($timeOut < $standardEndTime) {
                $undertimeHours = ($standardEndTime - $timeOut) / 3600;
                $employeeMap[$employeeId]['total_undertime_hours'] += $undertimeHours;
            }
    
            $workedHours = max(0, ($timeOut - $timeIn) / 3600);
            $regularHours = min($workedHours, $standardHoursPerDay);
            $overtimeHours = max(0, $workedHours - $standardHoursPerDay);
    
            $employeeMap[$employeeId]['total_regular_hours'] += $regularHours;
            $employeeMap[$employeeId]['total_overtime_hours'] += $overtimeHours;
        }
    
        $payrollData = array_values($employeeMap);
    
        foreach ($payrollData as $data) {
            $totalOvertimeAmount = $data['total_overtime_hours'] * $overtimeRateValue;
            $netSalary = ($data['total_regular_hours'] * $salaryRateValue) +
                        $totalOvertimeAmount -
                        $data['deduction'] +
                        $data['bonus'];
    
            $payrollDataToSave = [
                'name' => $data['name'],
                'total_regular_hours' => $data['total_regular_hours'],
                'total_overtime_hours' => $data['total_overtime_hours'],
                'total_late_hours' => $data['total_late_hours'],
                'total_undertime_hours' => $data['total_undertime_hours'],
                'deduction' => $data['deduction'],
                'bonus' => $data['bonus'],
                'net_salary' => $netSalary,
                'total_overtime_amount' => $totalOvertimeAmount,
                'year' => $year,
                'month' => $month,
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

    public function getPayrolls(Request $request)
    {
        $payrolls = Payroll::with('employee')->get();

        $formattedPayrolls = $payrolls->map(function ($payroll) {
            return [
                'id' => $payroll->id,
                'employeeId' => $payroll->employee_id,
                'employeeName' => $payroll->employee->name,
                'basicSalary' => $payroll->total_regular_hours * $payroll->salary_rate,
                'overtime' => $payroll->total_overtime_hours * $payroll->overtime_rate,
                'bonus' => $payroll->bonus,
                'deduction' => $payroll->deduction,
                'netSalary' => $payroll->net_salary,
                'status' => $payroll->status,
                'paymentDate' => $payroll->payment_date,
            ];
        });

        return response()->json(['payrolls' => $formattedPayrolls]);
    }
    
    public function generatePayslip($id, Request $request)
    {
        $payroll = Payroll::find($id);
    
        if (!$payroll) {
            return response()->json(['message' => 'Payroll record not found'], 404);
        }
        
        $employee = Employee::where('employee_id', $payroll->employee_id)->first();
    
        if (!$employee) {
            return response()->json(['message' => 'Employee record not found'], 404);
        }
    
        $benefits = [
            'health_insurance' => 500.00,
        ];
    
        $totalBenefits = array_sum($benefits);
    
        $payslipData = [
            'employeeName' => $payroll->name,
            'employeeId' => $payroll->employee_id,
            'job_position' => $employee->job_position,
            'overtime' => $payroll->total_overtime_amount,
            'deductions' => $payroll->deduction,
            'bonus' => $payroll->bonus,
            'netSalary' => $payroll->net_salary,
            'periodStart' => $payroll->year . '-' . str_pad($payroll->month, 2, '0', STR_PAD_LEFT) . '-01',
            'periodEnd' => $payroll->year . '-' . str_pad($payroll->month, 2, '0', STR_PAD_LEFT) . '-15', // Adjust as needed
            'dateIssued' => now()->format('Y-m-d'),
            'benefits' => $benefits,
            'totalBenefits' => $totalBenefits,
        ];
    
        $pdf = Pdf::loadView('payroll.payslip', compact('payslipData'));
    
        if ($request->query('view') === 'true') {
            return $pdf->stream('payslip_' . $payroll->id . '.pdf');
        }
        return $pdf->download('payslip_' . $payroll->id . '.pdf');
    }

}
