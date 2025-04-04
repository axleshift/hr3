<?php

namespace App\Http\Controllers\API;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\LeaveRequest;
use App\Models\Leave;
use App\Models\Employee;
use App\Models\Payroll;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use Barryvdh\DomPDF\Facade\Pdf;

class LeaveRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function calendarData(Request $request)
    {
        $startDate = Carbon::parse($request->input('start', Carbon::now()->startOfMonth()))->startOfDay();
        $endDate = Carbon::parse($request->input('end', Carbon::now()->endOfMonth()))->endOfDay();
        
        $leaves = LeaveRequest::with('user')
            ->where(function($query) use ($startDate, $endDate) {
                $query->whereBetween('start_date', [$startDate, $endDate])
                      ->orWhereBetween('end_date', [$startDate, $endDate])
                      ->orWhere(function($q) use ($startDate, $endDate) {
                          $q->where('start_date', '<', $startDate)
                            ->where('end_date', '>', $endDate);
                      });
            })
            ->get()
            ->map(function ($leave) {
                return [
                    'id' => $leave->id,
                    'title' => $leave->user->name . ' - ' . $leave->leave_type,
                    'start' => $leave->start_date,
                    'end' => Carbon::parse($leave->end_date)->addDay()->format('Y-m-d'),
                    'color' => $this->getStatusColor($leave->status),
                    'status' => $leave->status,
                    'leave_type' => $leave->leave_type,
                    'user_name' => $leave->user->name,
                    'department' => $leave->user->department->name ?? 'N/A',
                ];
            });
            
        return response()->json($leaves);
    }

    private function getStatusColor($status)
    {
        switch (strtolower($status)) {
            case 'approved':
                return '#28a745';
            case 'pending':
                return '#ffc107';
            case 'rejected':
                return '#dc3545';
            default:
                return '#17a2b8';
        }
    }

    public function statusCounts()
    {
        $counts = LeaveRequest::selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->status => $item->count];
            });
            
        return response()->json($counts);
    }

    public function viewReport(Request $request)
    {
        $year = $request->input('year', date('Y'));
        $month = $request->input('month', date('m'));
        
        $leaveRequests = LeaveRequest::with('user')
            ->whereYear('start_date', $year)
            ->whereMonth('start_date', $month)
            ->get()
            ->groupBy('user.department');
        
        $leave = Leave::all();
        
        $pdf = PDF::loadView('reports.leave', [
            'leaveRequests' => $leaveRequests,
            'leaveTypes' => $leave,
            'year' => $year,
            'month' => $month
        ]);
        
        return $pdf->stream('leave-report.pdf');
    }
    

    public function page(Request $request)
    {
        $year = $request->input('year', date('Y'));
        $month = $request->input('month', date('m'));
        
        $leaveRequests = LeaveRequest::whereYear('start_date', $year)
            ->whereMonth('start_date', $month)
            ->get();
        
        return response()->json([
            'status' => 200,
            'leaveRequests' => $leaveRequests,
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
            'documents' => 'sometimes|array',
            'document' => 'sometimes|file|mimes:jpg,jpeg,png,pdf,doc,docx,txt|max:500',
        ]);

        $employee = Employee::where('name', $request->name)->first();

        $user = User::where('name', $employee->name)->first();
        $employee = Employee::where('name', $request->name)->first();
        $type = Leave::where('name', $request->leave_type)->first();
    
        $user = User::find($request->user_id);
    
        if (!$user) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        $employee = Employee::where('name', $user->name)->first();
        if (!$employee) {
            return response()->json([
                'message' => 'Employee record not found.',
            ], 404);
        }

        if (!$type) {
            return response()->json(['message' => 'Leave type not found.'], 404);
        }
        $payroll = Payroll::where('name', $request->name)->first();
        if (!$payroll) {
            return response()->json(['message' => 'Payroll record not found for the employee.'], 404);
        }
    
        $daily_rate = $payroll->daily_rate;
    
        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);
        $total_days = $startDate->diffInDays($endDate) + 1;
        $month = $startDate->format('m');

        $is_paid = $type->pay_rate > 0 ? 'Paid' : 'Unpaid';
        $paid_amount = round($daily_rate * ($type->pay_rate / 100) * $total_days, 2);
        
        $filePaths = [];
        if ($request->hasFile('documents')) {
            foreach ($request->file('documents') as $file) {
                $filePaths[] = $file->store('documents', 'public');
            }
        }
    
        $leave = LeaveRequest::create([
            'user_id' => $user->id ?? null,
            'name' => $user->name,
            'leave_type' => $request->leave_type,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'reason' => $request->reason,
            'total_days' => $total_days,
            'status' => 'Pending',
            'is_paid' => $is_paid,
            'document_path' => json_encode($filePaths),
            'month' => $month,
            'department' => $employee->department,
            'job_position' => $employee->job_position,
            'leave_status' => 'Pending',
            'paid_amount' => $paid_amount,
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
            'leave_status' => 'sometimes|in:Pending,Approved,Rejected',
        ]);

        $leaveRequest->update($validated);

        return response()->json([
            'message' => 'Leave request updated successfully', 
            'data' => $leaveRequest
        ]);

  
        $leaveRequest = LeaveRequest::find($id);

        if (!$leaveRequest) {
            return response()->json([
                'message' => 'Leave request not found'
            ], 404);
        }

        $validated = $request->validate([
            'status' => 'sometimes|in:Pending,Approved,Rejected',
            'sometimes|in:Pending,Approved,Rejected',
            'leave_status' => 'sometimes|in:Pending,Approved,Rejected',
        ]);

        if (isset($validated['leave_status']) && $validated['leave_status'] === 'Approved' && $leaveRequest->is_paid === 'Paid') {
            $employee = Employee::where('name', $leaveRequest->name)->first();
            $type = Leave::where('name', $leaveRequest->leave_type)->first();
            
            if ($employee && $type) {
                $payroll = Payroll::where('employee_id', $employee->employee_id)
                    ->where('month', $leaveRequest->month)
                    ->first();
                    
                if ($payroll) {
                    $workingDaysInMonth = $this->getWorkingDaysInMonth($leaveRequest->month, date('Y'));
                    $dailyRate = $payroll->base_salary / $workingDaysInMonth;
                    $paid_amount = $dailyRate * $leaveRequest->total_days * ($type->pay_rate / 100);
                    
                    $leaveRequest->paid_amount = $paid_amount;
                }
            }
        }

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
    

    // public function generateReport(Request $request)
    // {
    //     $year = $request->input('year');
    //     $month = $request->input('month');
    //     $leaveRequests = LeaveRequest::whereYear('start_date', $year)
    //         ->whereMonth('start_date', $month)
    //         ->get();
    //     $groupedLeaveRequests = $leaveRequests->groupBy('department');
    //     $pdf = PDF::loadView('leave_report', [
    //         'leaveRequests' => $groupedLeaveRequests,
    //         'year' => $year,
    //         'month' => $month,
    //     ]);
    //     return $pdf->download("leave-report-{$year}-{$month}.pdf");
    // }

    public function leaveView(Request $request)
    {
        $year = $request->input('year');
        $month = $request->input('month');
        
        if (!$year || !$month) {
            return response()->json(['error' => 'Year and month parameters are required'], 400);
        }
    
        $leaveRequests = LeaveRequest::whereYear('start_date', $year)
            ->whereMonth('start_date', $month)
            ->get();
        
        if ($leaveRequests->isEmpty()) {
            return response()->json(['error' => 'No leave requests found for the selected period'], 404);
        }
    
        $groupedLeaveRequests = $leaveRequests->groupBy('department');
        
        $pdf = PDF::loadView('leave_report', [
            'leaveRequests' => $groupedLeaveRequests,
            'year' => $year,
            'month' => $month,
        ]);
        
        return $pdf->stream("leave-report-{$year}-{$month}.pdf");
    }

    public function getLeaveTypes()
    {
        $leaveTypes = Leave::all();
        return response()->json($leaveTypes);
    }

    public function generateReport(Request $request)
    {
        $request->validate([
            'year' => 'required|integer|min:2000|max:2100',
            'month' => 'required|integer|min:1|max:12',
        ]);

        $year = $request->input('year');
        $month = $request->input('month');

        $leaveRequests = LeaveRequest::where(function($query) use ($year, $month) {
                $query->whereYear('start_date', $year)
                      ->whereMonth('start_date', $month);
            })
            ->orWhere(function($query) use ($year, $month) {
                $query->whereYear('end_date', $year)
                      ->whereMonth('end_date', $month);
            })
            ->with('user')
            ->get()
            ->groupBy('department');

        $data = [
            'year' => $year,
            'month' => $month,
            'monthName' => date('F', mktime(0, 0, 0, $month, 1)),
            'leaveRequests' => $leaveRequests,
        ];
        $pdf = PDF::loadView('leave.leave_report', $data);
        return $pdf->download("leave-report-{$year}-{$month}.pdf");
    }

    public function viewDocuments($leaveRequestId)
    {
        $leaveRequest = LeaveRequest::findOrFail($leaveRequestId);
        $files = is_array($leaveRequest->document_path) 
        ? $leaveRequest->document_path 
        : json_decode($leaveRequest->document_path, true) ?? [];

        return view('leave.leave_documents', compact('leaveRequest', 'files'));    
    }
    
}