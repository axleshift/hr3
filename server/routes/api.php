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

// For Payroll Mgt
Route::post('/salaries', [SalaryController::class, 'store']);
Route::get('/salaries', [SalaryController::class, 'show']);
Route::get('/salaries', [SalaryController::class, 'index']);


Route::get('/attendances', [AttendanceController::class, 'index']);
Route::get('/rates', [SalaryController::class, 'getRates']);
Route::get('/payroll', [PayrollController::class, 'calculate']);
Route::post('/rates', [SalaryController::class, 'storeRates']);
Route::post('/payroll', [PayrollController::class, 'saveDeductionBonus']);
Route::get('/payroll/generate-payslip/{id}', [PayrollController::class, 'generatePayslip']);
Route::get('/payroll/{id}', [PayrollController::class, 'show']);
Route::get('/payrolls', [PayrollController::class, 'index']);
Route::put('/payrolls/{id}', [PayrollController::class, 'update']);
Route::get('/payslip', [PayrollController::class, 'viewPayslip']);
Route::get('/summary', [PayrollController::class, 'getSummary']);
    Route::get('/payslip/download', [PayrollController::class, 'downloadPayslip']);
    // Route::get('/payroll', [PayrollController::class, 'getPayrollSummary']);


// Leave type Mgt
Route::get('/leave-types', [LeaveController::class, 'index']);
Route::post('/leave-type', [LeaveController::class, 'store']);
Route::put('/leave-type/{id}', [LeaveController::class, 'update']);
Route::delete('/leave-type/{id}', [LeaveController::class, 'destroy']);

// Employee Leave REuqest Mgt
Route::get('/leave-requests/{employeeId}', [LeaveRequestController::class, 'employee']);
Route::get('/leave-requests', [LeaveRequestController::class, 'index']);
Route::get('/leave-requests/{id}', [LeaveRequestController::class, 'show']);   
Route::post('/leave-request', [LeaveRequestController::class, 'store']);
Route::put('/leave-requests/{id}', [LeaveRequestController::class, 'update']);
Route::post('/leave-requests/{id}', [LeaveRequestController::class, 'delete']);

// Coun for Dashboard
Route::get('/leave-requests/count/{status}', [LeaveRequestController::class, 'countLeaveRequests']);

Route::get('/employees', [EmployeeController::class, 'index']);
Route::get('/employees/{id}', [EmployeeController::class, 'show']);
Route::post('/employee', [EmployeeController::class, 'store']);
// Route::put('/employee/{id}', [EmployeeController::class, 'update']);
// Route::delete('/employees/{id}', [EmployeeController::class, 'destroy']);

Route::get('/profile/{userId}', [ProfileController::class, 'show']);
Route::post('/profile', [ProfileController::class, 'store']);
Route::put('/user/{id}', [ProfileController::class, 'update']);

// Limit for leave request of employee
Route::get('/leave-credits', [LeaveCreditController::class, 'index']);
Route::post('/leave-credit', [LeaveCreditController::class, 'store']);
Route::get('/leave-credit/{id}', [LeaveCreditController::class, 'show']);
Route::put('/leave-credit/{id}', [LeaveCreditController::class, 'update']);

Route::post('/benefits', [BenefitController::class, 'index']);
Route::get('/benefits/{id}', [BenefitController::class, 'show']);
Route::post('/benefit', [BenefitController::class, 'store']);
