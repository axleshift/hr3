<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\PayrollController;
use App\Http\Controllers\API\BenefitController;
use App\Http\Controllers\API\LeaveRequestController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\API\LeaveController;
use App\Http\Controllers\API\AttendanceController;
use App\Http\Controllers\API\EmployeeController;
use App\Http\Controllers\API\SalaryController;
use App\Http\Controllers\API\PayslipController;
use App\Http\Controllers\API\BenefitTypesController;
use App\Http\Controllers\API\ComplianceController;

// Count for Dashboard
Route::get('/leave-requests/count/{status}', [LeaveRequestController::class, 'countLeaveRequests']);
Route::get('/leave-statistics', [LeaveRequestController::class, 'getLeaveStatistics']);

Route::apiResource('compliances', ComplianceController::class);
Route::apiResource('attendances', AttendanceController::class);
Route::apiResource('benefit-types', BenefitTypesController::class);
Route::apiResource('salaries', PayrollController::class);
Route::apiResource('profiles', ProfileController::class);

Route::apiResource('rates', SalaryController::class);

Route::apiResource('employees', EmployeeController::class);
Route::get('/job-positions', [EmployeeController::class, 'getJobPositions']);
Route::get('/employees/${employeeId}', [EmployeeController::class, 'getLeaveHistory']);

Route::apiResource('benefits', BenefitController::class);

Route::apiResource('payrolls', PayrollController::class);
Route::post('/payroll', [PayrollController::class, 'save']);
Route::get('/payroll', [PayrollController::class, 'calculate']);
Route::post('payroll/release', [PayrollController::class, 'releasePayslips']);
Route::get('/payroll/download-report', [PayrollController::class, 'downloadReport']);

Route::apiResource('leave-types', LeaveController::class);
Route::get('/leave-types/{userId}', [LeaveController::class, 'get']);
Route::post('/leaves', [LeaveController::class, 'computeLeave']);
Route::get('/generate-leave', [LeaveRequestController::class, 'generateReport']);

Route::get('/leave-requests/page', [LeaveRequestController::class, 'page']);
Route::get('/leaves/{userId}', [LeaveRequestController::class, 'EmployeeInfo']);  
Route::get('/leave/{userId}', [EmployeeController::class, 'getID']); 
Route::get('/leave-requests', [LeaveRequestController::class, 'getLeaveRequests']);
Route::get('/leave-requests', [LeaveRequestController::class, 'index']);
Route::get('/leave-requests/{userId}', [LeaveRequestController::class, 'show']);  
Route::put('/leave-requests/{id}', [LeaveRequestController::class, 'update']);
Route::post('/leave-requests/{id}', [LeaveRequestController::class, 'destroy']);
Route::post('/leave-request', [LeaveRequestController::class, 'store']);
Route::put('/leave/{id}/approve', [LeaveRequestController::class, 'approveLeave']);

// Payslip
Route::get('/payslip', [PayslipController::class, 'index']);
Route::get('/payslips', [PayslipController::class, 'all']);
Route::get('/releases', [PayslipController::class, 'getPayslipsByUserId']);
Route::get('/releases/download/{employeeId}', [PayslipController::class, 'downloadPayslip']);
Route::get('/releases/download-all', [PayslipController::class, 'downloadAllPayslips']);
