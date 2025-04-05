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
use App\Http\Controllers\API\BudgetRequestController;

//integration
Route::post('/budgetRequest', [BudgetRequestController::class, 'store']);


// Count for Dashboard
Route::get('/leave-requests/count/{status}', [LeaveRequestController::class, 'countLeaveRequests']);
Route::get('/leave-statistics', [LeaveRequestController::class, 'getLeaveStatistics']);
Route::get('/leaves', [LeaveRequestController::class, 'calendarData']);
Route::get('/leave/status-counts', [LeaveRequestController::class, 'statusCounts']);


Route::get('/payrolls/month', [PayrollController::class, 'getPayrollByMonth']);
Route::apiResource('compliances', ComplianceController::class);
Route::apiResource('attendances', AttendanceController::class);
Route::apiResource('benefit-types', BenefitTypesController::class);

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
Route::get('/payslip', [PayslipController::class, 'all']);
Route::get('/releases', [PayslipController::class, 'getPayslipsByUserId']);
Route::get('/releases/download/{employeeId}', [PayslipController::class, 'downloadPayslip']);
Route::get('/releases/download-all', [PayslipController::class, 'downloadAllPayslips']);

Route::get('/payrolls/for-approval', [PayrollController::class, 'forApproval']);
Route::put('/payrolls/{id}/approve', [PayrollController::class, 'approve']);
Route::put('/payrolls/{id}/reject', [PayrollController::class, 'reject']);
