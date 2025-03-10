<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\PayrollController;
use App\Http\Controllers\API\BenefitController;
use App\Http\Controllers\API\LeaveRequestController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LeaveCreditController;
use App\Http\Controllers\API\LeaveController;
use App\Http\Controllers\API\AttendanceController;
use App\Http\Controllers\API\EmployeeController;
use App\Http\Controllers\API\SalaryController;
use App\Http\Controllers\API\PayslipController;

Route::post('/salaries', [SalaryController::class, 'store']);
Route::get('/salaries', [SalaryController::class, 'show']);
Route::get('/salaries', [SalaryController::class, 'index']);

// For Payroll Mgt
Route::get('/attendances', [AttendanceController::class, 'index']);
Route::get('/rates', [PayrollController::class, 'getRates']);
Route::get('/payroll', [PayrollController::class, 'calculate']);
Route::post('/rates', [PayrollController::class, 'storeRates']);
Route::post('/payroll', [PayrollController::class, 'saveDeductionBonus']);
Route::get('/payroll/{id}', [PayrollController::class, 'show']);
Route::get('/payroll/generate-payslip/{id}', [PayrollController::class, 'generatePayslip']);
Route::get('/payrolls', [PayrollController::class, 'getPayrolls']);
Route::put('/payrolls/{id}', [PayrollController::class, 'update']);

Route::get('/payslip', [PayrollController::class, 'viewPayslip']);
    Route::get('/payslip/download', [PayrollController::class, 'downloadPayslip']);
    
// Leave Mgt
Route::get('/leaves', [LeaveController::class, 'index']);
Route::post('/leave', [LeaveController::class, 'store']);
Route::put('/leaves/{id}', [LeaveController::class, 'update']);
Route::delete('/leave/{id}', [LeaveController::class, 'destroy']);

// Employee Leave REuqest Mgt
Route::get('/leave-requests/{employeeId}', [LeaveRequestController::class, 'employee']);
    Route::get('/leave-requests', [LeaveRequestController::class, 'index']);
    Route::get('/leave-requests/{id}', [LeaveRequestController::class, 'show']);   
    Route::post('/leave-request', [LeaveRequestController::class, 'store']);
    Route::put('/leave-requests/{id}', [LeaveRequestController::class, 'update']);
    Route::post('/leave-requests/{id}', [LeaveRequestController::class, 'delete']);

    // Coun for Dashboard
    Route::get('/leave-requests/count?status=Pending', [LeaveRequestController::class, 'countLeaveRequests']);

    Route::get('/employees', [EmployeeController::class, 'index']);
    Route::get('/employees/{id}', [EmployeeController::class, 'show']);
    Route::post('/employee', [EmployeeController::class, 'store']);
    // Route::put('/employee/{id}', [EmployeeController::class, 'update']);
    // Route::delete('/employees/{id}', [EmployeeController::class, 'destroy']);

    Route::get('/profile/{employeeId}', [ProfileController::class, 'getProfile']);
Route::post('/profile/upload', [ProfileController::class, 'uploadProfilePicture']);

// Limit for leave request of employee
Route::get('/leave-credits', [LeaveCreditController::class, 'index']);
Route::post('/leave-credit', [LeaveCreditController::class, 'store']);
Route::get('/leave-credit/{id}', [LeaveCreditController::class, 'show']);
Route::put('/leave-credit/{id}', [LeaveCreditController::class, 'update']);

Route::get('/benefits/{id}', [BenefitController::class, 'show']);
Route::post('/benefits', [BenefitController::class, 'store']);
