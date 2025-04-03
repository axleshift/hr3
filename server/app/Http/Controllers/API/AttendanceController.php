<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;


class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $query = Attendance::query()
            ->when($request->employee_id, function ($q) use ($request) {
                $q->where('employee_id', $request->employee_id);
            })
            ->when($request->start_date && $request->end_date, function ($q) use ($request) {
                $q->whereBetween('date', [
                    $request->start_date,
                    $request->end_date
                ]);
            });

        return response()->json($query->get());
    }
}