<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\API\DeductionController;
use App\Http\Controllers\API\DirectDepositController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\API\PayrollController;

Route::get('/payrolls', [PayrollController::class, 'index']);
Route::get('/payrolls/{id}', [PayrollController::class, 'show']);
Route::post('/addpayroll', [PayrollController::class, 'store']);
Route::get('/edit-payroll/{id}', [PayrollController::class, 'edit']);
Route::put('/payroll/{id}', [PayrollController::class, 'update']);
Route::delete('/deletepayroll/{id}', [PayrollController::class, 'destroy']);
Route::get('/payroll/{id}/payslip', [PayrollController::class, 'generatePayslip']);

Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
Route::post('/register', [RegisteredUserController::class, 'store']);
Route::get('/user', [AuthenticatedSessionController::class, 'user']);
Route::get('/users', [AuthenticatedSessionController::class, 'index']);

Route::get('/deductions', [DeductionController::class, 'index']);
Route::get('/deductions/{id}', [DeductionController::class, 'show']);
Route::post('/deduct', [DeductionController::class, 'store']);
Route::get('/edit-deduction/{id}', [DeductionController::class, 'edit']);
Route::put('/deduction/{id}', [DeductionController::class, 'update']);
Route::delete('/deletededuction/{id}', [DeductionController::class, 'destroy']);


Route::post('/direct-deposit', [DirectDepositController ::class, 'store']);
Route::get('/direct-deposit', [DirectDepositController ::class, 'index']);

Route::post('/expenses', [DirectDepositController ::class, '']);
Route::get('/expenses', [DirectDepositController ::class, 'index']);
Route::get('/expenses/{id}', [DirectDepositController ::class, 'show']);
Route::put('/expenses/{id}', [DirectDepositController ::class, 'update']);
