<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::get('/', function () {
    return view('index');
});


Route::prefix('api/auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/verify-session', [AuthController::class, 'verifySession']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

