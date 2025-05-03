<?php

use Illuminate\Support\Facades\Route;

use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use App\Http\Controllers\API\LeaveBalanceController;
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
use App\Http\Controllers\API\DisputeController;
use App\Http\Controllers\AuthController;

Route::get('/leave-requests/count/{status}', [LeaveRequestController::class, 'countLeaveRequests']);
Route::get('/leave-statistics', [LeaveRequestController::class, 'getLeaveStatistics']);
Route::get('/leave-calendar', [LeaveRequestController::class, 'calendarData']);
Route::get('/leave/status-counts', [LeaveRequestController::class, 'statusCounts']);

Route::get('/payrolls/filter', [PayrollController::class, 'filter']);
Route::get('/payrolls/month', [PayrollController::class, 'getPayrollByMonth']);
Route::apiResource('compliances', ComplianceController::class);
Route::apiResource('attendances', AttendanceController::class);
Route::apiResource('benefit-types', BenefitTypesController::class);

Route::apiResource('disputes', DisputeController::class);
Route::get('/disputes/statistics', [DisputeController::class, 'statistics']);
Route::get('/dispute/{userId}', [DisputeController::class, 'userDisputes']);

Route::apiResource('salaries', PayrollController::class);
Route::post('/salary', [PayrollController::class, 'saveSalary']);
Route::put('/salary/{id}', [PayrollController::class, 'updateSalary']);
Route::get('/salary', [PayrollController::class, 'getSalaries']);
Route::apiResource('profiles', ProfileController::class);

Route::apiResource('rates', SalaryController::class);
Route::get('/attendances', [AttendanceController::class, 'index']);
Route::get('/leave-documents/{leaveId}', [LeaveRequestController::class, 'viewDocuments']);


Route::apiResource('employees', EmployeeController::class);
Route::get('/job-positions', [EmployeeController::class, 'getJobPositions']);
Route::get('/employee/departments', [EmployeeController::class, 'getDepartments']);
Route::get('/employees/${employeeId}', [EmployeeController::class, 'getLeaveHistory']);

Route::apiResource('benefits', BenefitController::class);


Route::apiResource('payrolls', PayrollController::class);
Route::post('/payrolls', [PayrollController::class, 'index']);
Route::post('/payrolls', [PayrollController::class, 'store']);
Route::get('/payroll/download-report', [PayrollController::class, 'update']);
Route::put('/payrolls', [PayrollController::class, 'downloadReport']);
Route::post('/payrolls/calculate', [PayrollController::class, 'calculate']);
Route::post('/payrolls/calculate', [PayrollController::class, 'savePayrollRecord']);
Route::post('/bonus', [PayrollController::class, 'save']);
Route::post('/release', [PayrollController::class, 'releasePayslips']);

Route::get('/payroll/download-report', [PayrollController::class, 'downloadReport']);
Route::get('/bonus', [PayrollController::class, 'getBonus']);
Route::get('/payroll', [PayrollController::class, 'all']);

Route::apiResource('leave-types', LeaveController::class);

// Route::get('/leave-types/{userId}', [LeaveController::class, 'get']);
Route::post('/leaves', [LeaveController::class, 'computeLeave']);
Route::get('/generate-report', [LeaveRequestController::class, 'generateReport']);
Route::get('/generate-password', [LeaveController::class, 'generatePasswordApi']);
Route::get('/view-report', [LeaveRequestController::class, 'viewReport']);

Route::get('/leave-requests/page', [LeaveRequestController::class, 'page']);
Route::get('/leaves/{userId}', [LeaveRequestController::class, 'EmployeeInfo']);  
Route::get('/leave/{userId}', [EmployeeController::class, 'getID']); 
Route::get('/leave-requests', [LeaveRequestController::class, 'getLeaveRequests']);
Route::get('/leave-requests', [LeaveRequestController::class, 'index']);
Route::get('/leave-requests/{userId}', [LeaveRequestController::class, 'show']);  
Route::put('/leave-requests/{id}', [LeaveRequestController::class, 'update']);
Route::post('/leave-requests/{id}', [LeaveRequestController::class, 'destroy']);
Route::post('/leave-requests', [LeaveRequestController::class, 'store']);
Route::get('/leave-view', [LeaveRequestController::class, 'leaveView']);  


// Payslip
Route::get('/payslips', [PayslipController::class, 'index']);
Route::get('/payslip/all', [PayslipController::class, 'all']);
Route::get('/releases', [PayslipController::class, 'getPayslipsByUserId']);
Route::get('/releases/download/{employeeId}', [PayslipController::class, 'downloadPayslip']);
Route::get('/releases/download-all', [PayslipController::class, 'downloadAllPayslips']);
Route::post('/payslip/release', [PayslipController::class, 'releasePayslips']);
Route::post('/payslip/generate', [PayslipController::class, 'release']);

Route::get('/users', [AuthController::class, 'index']);

Route::post('/leave-balances', [LeaveBalanceController::class, 'store']);
    Route::get('/leave-balances/{employeeId}', [LeaveBalanceController::class, 'getEmployeeLeaveBalances']);
    Route::get('/leave-balances', [LeaveBalanceController::class, 'index']);

    Route::get('/all', [SalaryController::class, 'all']);

  