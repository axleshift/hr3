<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use App\Models\Attendance;

class AttendanceController extends Controller
{
    public function index()
    {
        $attendance = Attendance::all();
         return response()->json($attendance);
    }
}