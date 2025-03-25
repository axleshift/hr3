<?php

namespace App\Http\Controllers\API;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\LeaveRequest;
use App\Models\Leave;
use App\Models\Employee;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use Barryvdh\DomPDF\Facade\Pdf;

class LeaveRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function page(Request $request)
    {
        $perPage = $request->input('limit', 10);
        $page = $request->input('page', 1);
        
        $leaveRequests = LeaveRequest::paginate($perPage, ['*'], 'page', $page);

        $leaveRequests->getCollection()->transform(function ($leaveRequest) {
            $leaveRequest->is_paid = $leaveRequest->is_paid ? 'Paid' : 'Unpaid';
            return $leaveRequest;
        });

        return response()->json([
            'status' => 200,
            'leaveRequests' => $leaveRequests->items(),
            'totalPages' => $leaveRequests->lastPage(),
            'currentPage' => $leaveRequests->currentPage(),
        ]);
    }

    public function getLeaveRequests(Request $request)
    {
        $year = $request->input('year');
        $month = $request->input('month');

        $leaveRequests = LeaveRequest::whereYear('start_date', $year)
            ->whereMonth('start_date', $month)
            ->get();

        return response()->json([
            'leaveRequests' => $leaveRequests,
        ]);
    }
    
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

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer',
            'name' => 'required|string',
            'leave_type' => 'required',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string',
            'document' => 'sometimes|file|mimes:jpg,jpeg,png,pdf,doc,docx,txt|max:500',
        ]);
    
        $employee = Employee::where('name', $request->name)->first();
    
        if (!$employee) {
            return response()->json([
                'message' => 'Employee not found.',
            ], 404);
        }
    
        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);
        $total_days = $startDate->diffInDays($endDate) + 1;
        $month = $startDate->format('m');
    
        $filePath = null;
        if ($request->hasFile('document')) {
            $file = $request->file('document');
            $filePath = $file->store('documents', 'public');
        }
    
        $leave = LeaveRequest::create([
            'user_id' => $request->user_id,
            'name' => $request->name,
            'leave_type' => $request->leave_type,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'reason' => $request->reason,
            'total_days' => $total_days,
            'status' => 'Pending',
            'is_paid' => 'Unpaid',
            'document_path' => $filePath,
            'month' => $month,
            'department' => $employee->department,
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
        $leaveRequest = LeaveRequest::find($id);
        
        if (!$leaveRequest) {
            return response()->json([
                'message' => 'Leave request not found',
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'leaveRequests' => [$leaveRequest],
        ]);
    }

    public function EmployeeInfo($userId)
    {
        $leaveRequests = LeaveRequest::where('user_id', $userId)->get();

        if ($leaveRequests->isEmpty()) {
            Log::info('No leave requests found for user ID: ' . $userId);
            return response()->json([
                'message' => 'No leave requests found for this user.',
                'leaveRequests' => []
            ], 200);
        }

        return response()->json([
            'status' => 200,
            'leaveRequests' => $leaveRequests,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $leaveRequest = LeaveRequest::find($id);

        if (!$leaveRequest) {
            return response()->json([
                'message' => 'Leave request not found'
            ], 404);
        }

        $validated = $request->validate([
            'status' => 'sometimes|in:Pending,Approved,Rejected',
            'is_paid' => 'sometimes|boolean',
        ]);

        $leaveRequest->update($validated);

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

    public function getLeaveStatistics()
    {
        $leaveRequests = LeaveRequest::all();
    
        $statistics = [
            'total_leave_requests' => $leaveRequests->count(),
            'total_paid_leave' => $leaveRequests->where('is_paid', 'Paid')->count(),
            'total_unpaid_leave' => $leaveRequests->where('is_paid', 'Unpaid')->count(),
            'total_approved_leave' => $leaveRequests->where('status', 'Approved')->count(),
            'total_rejected_leave' => $leaveRequests->where('status', 'Rejected')->count(),
            'leave_types' => $leaveRequests->groupBy('leave_type')->map->count(),
        ];
    
        return response()->json($statistics);
    }

    // public function approveLeaveRequest($id)
    // {
    //     $leave = Leave::findOrFail($id);
    //     if ($leave->status === 'Approved') {
    //         return response()->json(['message' => 'Leave request is already approved.'], 400);
    //     }
    
    //     $leave->leave_used += $leave->total_days;
    //     $leave->status = 'Approved';
    //     $leave->save();
    //     return response()->json(['message' => 'Leave request approved successfully.'], 200);
    // }

    public function generateReport(Request $request)
    {
        $year = $request->input('year');
        $month = $request->input('month');
        $leaveRequests = LeaveRequest::whereYear('start_date', $year)
            ->whereMonth('start_date', $month)
            ->get();
        $groupedLeaveRequests = $leaveRequests->groupBy('department');
        $pdf = PDF::loadView('leave_report', [
            'leaveRequests' => $groupedLeaveRequests,
            'year' => $year,
            'month' => $month,
        ]);
        return $pdf->download("leave-report-{$year}-{$month}.pdf");
    }
}