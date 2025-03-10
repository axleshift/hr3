<?php

namespace App\Http\Controllers\API;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\LeaveRequest;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;


class LeaveRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $leaveRequests = LeaveRequest::all();
        return response()->json([
            'status' => 200,
            'leaveRequests' => $leaveRequests,
        ]);
    }

    public function countLeaveRequests($status)
    {
        $count = LeaveRequest::where('status', $status)->count();
        return response()->json(['count' => $count]);
    }

    public function employee($employeeId)
    {
        $leaveRequests = LeaveRequest::where('employee_id', $employeeId)->get();
        return response()->json([
            'status' => 200,
            'leaveRequests' => $leaveRequests,
        ]);
    }

    public function getLeaveRequests($employeeId)
    {
        $leaveRequests = LeaveRequest::where('employee_id', $employeeId)->get();
        return response()->json($leaveRequests);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'leave_type' => 'required',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string',
            'is_paid' => 'sometimes|boolean',
            'document' => 'sometimes|file|mimes:jpg,jpeg,png,pdf,doc,docx,txt|max:10240',
        ]);

        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);
        $total_days = $startDate->diffInDays($endDate) + 1;

        $filePath = null;
        if ($request->hasFile('document')) {
            $file = $request->file('document');
            $filePath = $file->store('documents', 'public');
        }

        $leave = LeaveRequest::create([
            'employee_id' => $request->employee_id,
            'name' => $request->name,
            'leave_type' => $request->leave_type,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'reason' => $request->reason,
            'total_days' => $total_days,
            'status' => 'Pending',
            'is_paid' => $request->is_paid ?? false,
            'document_path' => $filePath,
        ]);
        
        return response()->json([
            'message' => 'Leave request submitted successfully',
            'data' => $leave
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        // $leaveRequest = LeaveRequest::findOrFail($id);
        // return response()->json(['leaveRequest' => $leaveRequest]);

        $leaveRequest = LeaveRequest::findOrFail($id);
        if (!$leaveRequest) {
            return response()->json(['message' => 'Leave request not found'], 404);
        }
        return response()->json($leaveRequest);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'status' => 'sometimes|in:Approved,Rejected,Pending',
            'is_paid' => 'sometimes|boolean',
        ]);

        $leaveRequest = LeaveRequest::findOrFail($id);
        if ($request->has('status')) {
            // $leaveRequest->status = $request->status;
            if ($request->status == 'Approved') {
                $leaveRequest->approved_date = now(); // Set the approved date to the current date
            }
            $leaveRequest->status = $request->status;
        }

        if ($request->has('is_paid')) {
            $leaveRequest->is_paid = $request->is_paid;
        }
        $leaveRequest->save();
        return response()->json([
            'message' => 'Leave request updated successfully',
            'data' => $leaveRequest
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $leaveRequest = LeaveRequest::findOrFail($id);
        $leaveRequest->delete();
    
        return response()->json([
            'message' => 'Leave request deleted successfully',
        ]);
    }
}
