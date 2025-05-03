<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Attendance;
use App\Models\Payslip;
use App\Models\Payroll;
use App\Models\Employee;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Mail\PayslipEmail;
use Mpdf\Mpdf;
use Illuminate\Support\Facades\Mail;

class PayslipController extends Controller
{
    // public function index()
    // {
    //     $payslips = Payslip::where('user_id', Auth::id())->get();
    //     return response()->json($payslips);
    // }

    public function all(Request $request)
    {
        $year = $request->input('year', date('Y'));
        $month = $request->input('month', date('m'));
        
        $payslips = Payslip::where('year', $year)
            ->where('month', $month)
            ->get();
            
        return response()->json($payslips);

    }

    public function getPayslipsByUserId(Request $request)
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

            return response()->json([
                'message' => 'Payslips fetched successfully.',
                'payslips' => $payslips,
            ], 200);
        
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
            'benefits_total' => $payslip->benefits_total,
            'net_salary' => $payslip->net_salary,
            'tax'=> $payslip->tax,
            'total_overtime_amount' => $payslip->total_overtime_amount,
            'bonus' => $payslip->bonus,
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

    public function index(Request $request)
    {
        $request->validate([
            'year' => 'required|integer',
            'month' => 'required|integer|between:1,12'
        ]);

        $payslips = Payslip::with(['employee'])
            ->where('year', $request->year)
            ->where('month', $request->month)
            ->get();

        return response()->json($payslips);
    }

    // public function releasePayslips(Request $request)
    // {
    //     $selectedMonth = $request->input('month');
    //     $selectedYear = $request->input('year');
    
    //     if (!$selectedMonth || !$selectedYear) {
    //         return response()->json([
    //             'message' => 'Month and year are required.',
    //         ], 400);
    //     }
    
    //     $existingPayslips = Payslip::where('month', $selectedMonth)
    //         ->where('year', $selectedYear)
    //         ->exists();
    
    //     if ($existingPayslips) {
    //         return response()->json([
    //             'message' => 'Payslips for this month/year have already been released.',
    //         ], 400);
    //     }
    
    //     $payrolls = Payroll::where('month', $selectedMonth)
    //         ->where('year', $selectedYear)
    //         ->orderBy('period', 'desc')
    //         ->get()
    //         ->unique('employee_id');
    
    //     if ($payrolls->isEmpty()) {
    //         return response()->json([
    //             'message' => 'No payroll records found for this period.',
    //             'count' => 0
    //         ], 200);
    //     }
    
    //     $createdCount = 0;
    //     foreach ($payrolls as $payroll) {
    //         // Generate PDF
    //         $pdf = PDF::loadView('payroll.payslip', [
    //             'payroll' => $payroll,
    //             'monthName' => date('F', mktime(0, 0, 0, $selectedMonth, 1)),
    //             'year' => $selectedYear
    //         ]);
    
    //         $filename = "payslip-{$payroll->employee_id}-{$selectedMonth}-{$selectedYear}.pdf";
    //         $pdfPath = storage_path("app/payslips/{$filename}");
            
    //         // Save PDF to storage
    //         if (!file_exists(storage_path('app/payslips'))) {
    //             mkdir(storage_path('app/payslips'), 0777, true);
    //         }
    //         $pdf->save($pdfPath);
    
    //         // Create payslip record
    //         $payslip = Payslip::create([
    //             'user_id' => $payroll->user_id,
    //             'employee_id' => $payroll->employee_id,
    //             'name' => $payroll->name,
    //             'department' => $payroll->department,
    //             'job_position' => $payroll->job_position,
    //             'month' => $selectedMonth,
    //             'year' => $selectedYear,
    //             'net_salary' => $payroll->net_salary,
    //             'tax' => $payroll->tax,
    //             'benefits_total' => $payroll->benefits_total,
    //             'base_salary' => $payroll->base_salary,
    //             'bonus' => $payroll->bonus,
    //             'total_overtime_amount' => $payroll->total_overtime_amount,
    //             'total_regular_hours' => $payroll->total_regular_hours,
    //             'total_overtime_hours' => $payroll->total_overtime_hours,
    //             'total_late_hours' => $payroll->total_late_hours,
    //             'total_undertime_hours' => $payroll->total_undertime_hours,
    //             'working_days' => $payroll->working_days,
    //             'daily_rate' => $payroll->daily_rate,
    //             'monthly_rate' => $payroll->monthly_rate,
    //             'gross_salary' => $payroll->gross_salary,
    //             'paid_leave_amount' => $payroll->paid_leave_amount,
    //             'start_date' => $payroll->start_date,
    //             'end_date' => $payroll->end_date,
    //             'status' => 'Generated',
    //             'issued_at' => now(),
    //             'pdf_path' => $pdfPath,
    //         ]);
    
    //         // Send email with payslip
    //         try {
    //             $user = User::find($payroll->user_id);
    //             if ($user && $user->email) {
    //                 Mail::to($user->email)->send(new PayslipEmail($payslip, $pdfPath));
    //             }
    //         } catch (\Exception $e) {
    //             Log::error("Failed to send payslip email: " . $e->getMessage());
    //         }
    
    //         $createdCount++;
    //     }
    
    //     return response()->json([
    //         'message' => 'Payslips released and emailed successfully!',
    //         'count' => $createdCount
    //     ], 200);
    // }

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
                'message' => 'Payslips for this month/year have already been released.',
            ], 400);
        }
    
        $payrolls = Payroll::where('month', $selectedMonth)
            ->where('year', $selectedYear)
            ->orderBy('period', 'desc')
            ->get()
            ->unique('employee_id');
    
        if ($payrolls->isEmpty()) {
            return response()->json([
                'message' => 'No payroll records found for this period.',
                'count' => 0
            ], 200);
        }
    
        $createdCount = 0;
        foreach ($payrolls as $payroll) {
            $password = $this->generatePassword($payroll);
            
            $pdf = PDF::loadView('payroll.payslip', [
                'payroll' => $payroll,
                'monthName' => date('F', mktime(0, 0, 0, $selectedMonth, 1)),
                'year' => $selectedYear
            ]);
            
            $pdf->setEncryption(
                $password,
                $password,
                ['copy', 'print'],
                128
            );
            
            $filename = "payslip-{$payroll->employee_id}-{$selectedMonth}-{$selectedYear}.pdf";
            $pdfPath = storage_path("app/payslips/{$filename}");
            
            if (!file_exists(storage_path('app/payslips'))) {
                mkdir(storage_path('app/payslips'), 0777, true);
            }
            
            $pdf->save($pdfPath);
    
            $payslip = Payslip::create([
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
                'status' => 'Generated',
                'issued_at' => now(),
                'pdf_path' => $pdfPath,
                'pdf_password' => $password
            ]);
    
            try {
                $user = User::find($payroll->user_id);
                if ($user && $user->email) {
                    Mail::to($user->email)->send(new PayslipEmail($payslip, $pdfPath, $password));
                }
            } catch (\Exception $e) {
                Log::error("Failed to send payslip email: " . $e->getMessage());
            }
    
            $createdCount++;
        }
    
        return response()->json([
            'message' => 'Payslips released and emailed successfully!',
            'count' => $createdCount
        ], 200);
    }
    
    /**
     * Generate a unique password for the PDF
     */
    private function generatePassword($payroll)
    {
        return $payroll->employee_id . date('my');
    }
}