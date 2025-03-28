<?php

namespace App\Http\Controllers\API;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\LeaveRequest;
use App\Models\Leave;
use App\Models\Employee;
use App\Models\Payroll;
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
        $type = Leave::where('name', $request->type)->first();
    
        if (!$employee) {
            return response()->json([
                'message' => 'Employee not found.',
            ], 404);
        }

        if (!$type) {
            return response()->json(['message' => 'Leave type not found.'], 404);
        }
    
        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);
        $total_days = $startDate->diffInDays($endDate) + 1;
        $month = $startDate->format('m');

        $is_paid = $type->pay_rate > 0 ? 'Paid' : 'Unpaid';
        $paid_amount = ($type->pay_rate / 100) * $employee->salary * $total_days;
    
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
            'is_paid' => $is_paid,
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

    public function approveLeaveRequest(Request $request, $id)
    {
        $leaveRequest = LeaveRequest::findOrFail($id);
        
        // Update leave request status
        $leaveRequest->update(['status' => 'Approved']);
        
        // Calculate and store paid leave if applicable
        if ($leaveRequest->leave->type === 'Paid') {
            $leaveDays = $leaveRequest->total_days; // Assuming you have this field
            
            // Call the computeLeave method
            $response = app(LeaveController::class)->computeLeave(new Request([
                'user_id' => $leaveRequest->user_id,
                'leave_type_id' => $leaveRequest->leave_id,
                'leave_days_used' => $leaveDays,
                'month' => $leaveRequest->start_date->month,
                'year' => $leaveRequest->start_date->year,
            ]));
            
            // You might want to handle the response here
        }
        
        return response()->json(['message' => 'Leave request approved']);
    }

    public function computeLeave(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'leave_type_id' => 'required|exists:leaves,id',
            'leave_days_used' => 'required|integer|min:1',
            'month' => 'required|integer|between:1,12',
            'year' => 'required|integer',
        ]);
    
        $employee = Employee::where('user_id', $request->user_id)->first();
        $leaveType = Leave::find($request->leave_type_id);
    
        if (!$employee || !$leaveType) {
            return response()->json(['message' => 'Employee or leave type not found'], 404);
        }
    
        if ($leaveType->type !== 'Paid') {
            return response()->json(['message' => 'Leave type is not paid'], 400);
        }
    
        // Find or create payroll record for this employee/month/year
        $payroll = Payroll::firstOrCreate(
            [
                'user_id' => $request->user_id,
                'month' => $request->month,
                'year' => $request->year,
            ],
            [
                'employee_id' => $employee->id,
                'name' => $employee->name,
                'department' => $employee->department,
                'job_position' => $employee->job_position,
                'base_salary' => $employee->monthly_salary,
                'status' => 'Pending',
            ]
        );
    
        // Calculate hourly rate based on monthly salary and total regular hours
        if ($payroll->total_regular_hours > 0) {
            $hourlyRate = $employee->monthly_salary / $payroll->total_regular_hours;
        } else {
            // Fallback to standard calculation if no regular hours recorded
            $standardWorkingHoursPerMonth = 22 * 8; // 22 days * 8 hours/day as default
            $hourlyRate = $employee->monthly_salary / $standardWorkingHoursPerMonth;
        }
    
        // Calculate paid leave amount (convert leave days to hours: 1 day = 8 hours)
        $leaveHours = $request->leave_days_used * 8;
        $paidLeaveAmount = ($hourlyRate * $leaveHours) * ($leaveType->pay_rate / 100);
    
        // Update the payroll with only the paid leave amount
        $payroll->update([
            'daily_rate' => $hourlyRate * 8, // Store daily rate (8 hours)
            'paid_leave_amount' => $paidLeaveAmount,
            // Update gross salary to include the paid leave amount
            'gross_salary' => ($payroll->gross_salary ?? $employee->monthly_salary) + $paidLeaveAmount,
        ]);
    
        return response()->json([
            'user_id' => $employee->user_id,
            'leave_type_id' => $leaveType->id,
            'leave_days_used' => $request->leave_days_used,
            'leave_hours' => $leaveHours,
            'hourly_rate' => number_format($hourlyRate, 2),
            'paid_leave_amount' => number_format($paidLeaveAmount, 2),
            'message' => 'Paid leave calculated and payroll updated',
        ]);
    }

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