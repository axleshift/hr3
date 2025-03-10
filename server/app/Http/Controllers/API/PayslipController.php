<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payroll;
use App\Models\Employee;
use PDF;
use Illuminate\Support\Facades\Auth;

class PayslipController extends Controller
{
    public function viewEmployeePayslip()
    {
        // Get the logged-in employee's ID
        $employeeId = Auth::user()->employee_id;
    
        // Fetch the latest payroll record for the employee
        $payroll = Payroll::where('employee_id', $employeeId)->latest()->first();
    
        if (!$payroll) {
            return redirect()->back()->with('error', 'No payroll record found.');
        }
    
        // Fetch the employee details
        $employee = Employee::where('employee_id', $employeeId)->first();
    
        if (!$employee) {
            return redirect()->back()->with('error', 'Employee record not found.');
        }
    
        // Define benefits (this can be dynamic based on your application logic)
        $benefits = [
            'health_insurance' => 500.00,
        ];
    
        $totalBenefits = array_sum($benefits);
    
        // Prepare payslip data
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
    
        // Load the view with the payslip data
        return view('employee.payslip', compact('payslipData'));
    }

    public function getEmployeePayslip($employeeId, Request $request)
{
    $year = $request->query('year');
    $month = $request->query('month');

    $payroll = Payroll::where('employee_id', $employeeId)
        ->where('year', $year)
        ->where('month', $month)
        ->first();

    if (!$payroll) {
        return response()->json(['message' => 'No payslip data available for the selected month and year.'], 404);
    }

    return response()->json($payroll);
}

public function getEmployeePayslips($employeeId)
{
    $payrolls = Payroll::where('employee_id', $employeeId)->get();

    if ($payrolls->isEmpty()) {
        return response()->json(['message' => 'No payslip data available.'], 404);
    }

    return response()->json($payrolls);
}
}
