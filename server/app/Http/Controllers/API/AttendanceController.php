<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use App\Models\Attendance;

class AttendanceController extends Controller
{
    public function index()
    {
        $attendances = Attendance::paginate(10);
        return response()->json([
            'attendances' => $attendances->items(),
            'totalPages' => $attendances->lastPage(),
        ]);
    }
}