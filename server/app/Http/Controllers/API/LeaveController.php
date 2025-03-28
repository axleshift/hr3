<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Leave;
use App\Models\Employee;
use App\Models\LeaveRequest;

class LeaveController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $leaves = Leave::all();
        return response()->json($leaves);
    }

      /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:Paid,Unpaid',
            'pay_rate' => 'required|numeric',
        ]);
    
        $leave = Leave::create($validatedData);
    
        return response()->json($leave, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $leave = Leave::find($id);
        
        if (!$leave) {
            return response()->json([
                'message' => 'Leave not found',
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'leaves' => [$leave],
        ]);
    }

     /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:Paid,Unpaid',
            'pay_rate' => 'required|numeric',
        ]);
        $leave = Leave::findOrFail($id);
        $leave->update($request->only('name', 'type', 'pay_rate'));

        return response()->json($leave);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $leave = Leave::findOrFail($id);
        $leave->delete();

        return response()->json([
            'message' => 'Leave type deleted successfully']);
    }

    // public function getLeaveUsed($userId, $month, $year)
    // {
    //     $totalLeaveUsed = Leave::where('user_id', $userId)
    //         ->where('status', 'Approved')
    //         ->whereMonth('start_date', $month)
    //         ->whereYear('start_date', $year)
    //         ->sum('total_days');
    
    //     return response()->json(['total_leave_used' => $totalLeaveUsed], 200);
    // }
}
