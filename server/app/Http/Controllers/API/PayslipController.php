<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Payroll;
use App\Models\Attendance;
use App\Models\Payslip;
use App\Models\Employee;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Barryvdh\DomPDF\Facade\Pdf;

class PayslipController extends Controller
{
    public function index()
    {
        $payslips = Payroll::where('user_id', Auth::id())->get();
        return response()->json($payslips);
    }

    public function all()
    {
        $payslips = Payroll::all();
        return response()->json($payslips);
    }

    public function getPayslipsByUserId(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'user_id' => 'required|integer|exists:users,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation error',
                    'errors' => $validator->errors(),
                ], 400);
            }

            $userId = $request->input('user_id');
            $payslips = Payslip::where('user_id', $userId)->get();

            if ($payslips->isEmpty()) {
                return response()->json([
                    'message' => 'No payslips found for the specified user.',
                ], 404);
            }

            return response()->json([
                'message' => 'Payslips retrieved successfully.',
                'payslips' => $payslips,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching payslips: ' . $e->getMessage());
            return response()->json([
                'message' => 'An error occurred while fetching payslips.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function downloadPayslip($employeeId)
    {
        $employee = Employee::where('employee_id', $employeeId)->first();
        $payslip = Payslip::where('employee_id', $employeeId)->first();

        if (!$employee || !$payslip) {
            return response()->json(['message' => 'Employee or payslip not found.'], 404);
        }

        $attendanceRecords = Attendance::where('employee_id', $employeeId)
            ->orderBy('date', 'asc')
            ->get();

        if ($attendanceRecords->isEmpty()) {
            return response()->json(['message' => 'No attendance records found for the employee.'], 404);
        }

        $firstAttendanceDate = $attendanceRecords->first()->date;
        $lastAttendanceDate = $attendanceRecords->last()->date;

        $payslipData = [
            'employeeName' => $employee->name,
            'employeeId' => $employee->employee_id,
            'job_position' => $employee->job_position,
            'periodStart' => $firstAttendanceDate,
            'periodEnd' => $lastAttendanceDate,
            'dateIssued' => now()->format('m-d-Y'),
            'base_salary' => $payslip->base_salary,
            'overtime' => $payslip->total_overtime_amount,
            'bonus' => $payslip->bonus,
            'deductions' => $payslip->deduction,
        ];

        $pdf = Pdf::loadView('payroll.payslip', ['payslipData' => $payslipData]);
        return $pdf->download("payslip-{$employee->employee_id}.pdf");
    }

    public function downloadAllPayslips(Request $request)
    {
            $validator = Validator::make($request->all(), [
                'user_id' => 'required|integer|exists:users,id',
            ]);
    
            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation error',
                    'errors' => $validator->errors(),
                ], 400);
            }
    
            $userId = $request->input('user_id');
            $payslips = Payslip::where('user_id', $userId)->get();
    
            if ($payslips->isEmpty()) {
                return response()->json([
                    'message' => 'No payslips found for the specified user.',
                ], 404);
            }
    
            $payslipData = [];
            foreach ($payslips as $payslip) {
                $employee = Employee::where('employee_id', $payslip->employee_id)->first();
                $attendanceRecords = Attendance::where('employee_id', $payslip->employee_id)
                    ->whereYear('date', $payslip->year)
                    ->whereMonth('date', $payslip->month)
                    ->orderBy('date', 'asc')
                    ->get();
    
                if ($attendanceRecords->isEmpty()) {
                    $firstAttendanceDate = "{$payslip->year}-{$payslip->month}-01";
                    $lastAttendanceDate = date('Y-m-t', strtotime($firstAttendanceDate));
                } else {
                    $firstAttendanceDate = $attendanceRecords->first()->date;
                    $lastAttendanceDate = $attendanceRecords->last()->date;
                }
    
                $payslipData[] = [
                    'employeeName' => $employee->name,
                    'employeeId' => $employee->employee_id,
                    'job_position' => $employee->job_position,
                    'periodStart' => $firstAttendanceDate,
                    'periodEnd' => $lastAttendanceDate,
                    'dateIssued' => now()->format('m-d-Y'),
                    'base_salary' => $payslip->base_salary,
                    'overtime' => $payslip->total_overtime_amount,
                    'bonus' => $payslip->bonus,
                    'deductions' => $payslip->deduction,
                ];
            }
            $pdf = Pdf::loadView('payroll.all_payslips', ['payslips' => $payslipData]);
            return $pdf->download("all-payslips.pdf");
            
            return response()->json([
                'message' => 'An error occurred while downloading all payslips.',
                'error' => $e->getMessage(),
            ], 500);
    }
}
