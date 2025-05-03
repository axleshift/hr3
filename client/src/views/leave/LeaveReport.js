import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormSelect,
  CButton,
  CSpinner,
  CAlert,
  CBadge,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePdf, faLock } from '@fortawesome/free-solid-svg-icons'
import api from '../../util/api'

const LeaveReport = () => {
  const [leaveRequests, setLeaveRequests] = useState([])
  const [leaveTypes, setLeaveTypes] = useState([])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const years = Array.from({ length: new Date().getFullYear() - 2020 + 1 }, (_, i) => 2020 + i)

  const fetchLeaveData = async () => {
    try {
      setLoading(true)
      setError(null)

      const params =
        selectedYear && selectedMonth ? { year: selectedYear, month: selectedMonth } : {}

      const [leaveRes, typesRes] = await Promise.all([
        api.get('/leave-requests/page', { params }),
        api.get('/leave-types'),
      ])

      setLeaveRequests(leaveRes.data.leaveRequests || leaveRes.data)
      setLeaveTypes(typesRes.data)
    } catch (err) {
      setError('Error fetching leave data.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaveData()
  }, [selectedYear, selectedMonth])

  const groupByDepartment = (leaveData) => {
    return leaveData.reduce((acc, leave) => {
      const department = leave.department || 'Unassigned'
      if (!acc[department]) {
        acc[department] = []
      }
      acc[department].push(leave)
      return acc
    }, {})
  }

  const handleDownloadPDF = async () => {
    try {
      setLoading(true)
      setError(null)
      const password = `${selectedMonth}/${selectedYear}`

      const params = {
        year: selectedYear,
        month: selectedMonth,
        password: password,
      }

      const response = await api.get('/generate-report', {
        params,
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `leave-report-${selectedYear}-${selectedMonth}.pdf`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      setError('Error generating PDF report.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // const handleViewPDF = () => {
  //   const params = new URLSearchParams({
  //     year: selectedYear,
  //     month: selectedMonth,
  //   })
  //   window.open(`${api.defaults.baseURL}/view-view?${params}`, '_blank')
  // }

  const getStatusBadge = (status) => {
    let color
    switch (status) {
      case 'Approved':
        color = 'success'
        break
      case 'Rejected':
        color = 'danger'
        break
      default:
        color = 'warning'
    }
    return <CBadge color={color}>{status}</CBadge>
  }

  const getPaidBadge = (isPaid) => {
    return isPaid === 'Paid' ? (
      <CBadge color="success">Paid</CBadge>
    ) : (
      <CBadge color="secondary">Unpaid</CBadge>
    )
  }

  const departmentHeaderStyle = {
    fontWeight: 'bold',
    fontSize: '1.1em',
    padding: '10px',
    backgroundColor: '#f0f0f0',
  }

  return (
    <div>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center flex-wrap">
          <strong>Leave Report</strong>
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <CFormSelect
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              style={{ width: '120px' }}
            >
              {Array.from({ length: 12 }, (_, i) => {
                const monthIndex = i + 1
                return (
                  <option key={monthIndex} value={monthIndex}>
                    {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                  </option>
                )
              })}
            </CFormSelect>
            <CFormSelect
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              style={{ width: '90px' }}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </CFormSelect>
            <CButton color="danger" onClick={handleDownloadPDF} disabled={loading}>
              <FontAwesomeIcon icon={faFilePdf} /> Export
            </CButton>
            {/* <CButton color="info" onClick={handleViewPDF} className="ms-2" disabled={loading}>
              <FontAwesomeIcon icon={faLock} /> View PDF
            </CButton> */}
          </div>
        </CCardHeader>

        <CCardBody>
          {error && <CAlert color="danger">{error}</CAlert>}

          {loading ? (
            <div className="d-flex justify-content-center">
              <CSpinner color="primary" />
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <CTable striped bordered responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell className="text-center">ID</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Employee ID</CTableHeaderCell>
                      <CTableHeaderCell>Name</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Department</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Job Position</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Leave Type</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Duration</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Days</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Reason</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Paid</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {leaveRequests.length > 0 ? (
                      Object.entries(groupByDepartment(leaveRequests)).map(
                        ([department, leaves]) => (
                          <React.Fragment key={department}>
                            <CTableRow>
                              <CTableDataCell colSpan="10" style={departmentHeaderStyle}>
                                <strong>{department} Department</strong>
                              </CTableDataCell>
                            </CTableRow>
                            {leaves.map((leave) => (
                              <CTableRow key={leave.id}>
                                <CTableDataCell>{leave.id}</CTableDataCell>
                                <CTableDataCell>{leave.employeeId}</CTableDataCell>
                                <CTableDataCell>{leave.name}</CTableDataCell>
                                <CTableDataCell className="text-center">
                                  {leave.department || 'Unassigned'}
                                </CTableDataCell>
                                <CTableDataCell className="text-center">
                                  {leave.job_position}
                                </CTableDataCell>
                                <CTableDataCell className="text-center">
                                  {leave.leave_type}
                                </CTableDataCell>
                                <CTableDataCell className="text-center">
                                  {new Date(leave.start_date).toLocaleDateString()} -{' '}
                                  {new Date(leave.end_date).toLocaleDateString()}
                                </CTableDataCell>
                                <CTableDataCell className="text-center">
                                  {leave.total_days}
                                </CTableDataCell>
                                <CTableDataCell className="text-center">
                                  {leave.reason}
                                </CTableDataCell>
                                <CTableDataCell className="text-center">
                                  {getPaidBadge(leave.is_paid)}
                                </CTableDataCell>
                                <CTableDataCell className="text-center">
                                  {getStatusBadge(leave.status)}
                                </CTableDataCell>
                              </CTableRow>
                            ))}
                          </React.Fragment>
                        ),
                      )
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan="10" className="text-center">
                          No leave data available for the selected period
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              </div>
            </>
          )}
        </CCardBody>
      </CCard>
    </div>
  )
}

export default LeaveReport

// <?php

// namespace App\Http\Controllers\API;

// use Carbon\Carbon;
// use Illuminate\Http\Request;
// use App\Models\LeaveRequest;
// use App\Models\Leave;
// use App\Models\Employee;
// use App\Models\Payroll;
// use App\Models\User;
// use App\Http\Controllers\Controller;
// use Illuminate\Support\Facades\Log;
// use Barryvdh\DomPDF\Facade\Pdf;

// class LeaveRequestController extends Controller
// {
//     /**
//      * Display a listing of the resource.
//      */

//     public function calendarData(Request $request)
//     {
//         $startDate = Carbon::parse($request->input('start', Carbon::now()->startOfMonth()))->startOfDay();
//         $endDate = Carbon::parse($request->input('end', Carbon::now()->endOfMonth()))->endOfDay();

//         $leaves = LeaveRequest::with('user')
//             ->where(function($query) use ($startDate, $endDate) {
//                 $query->whereBetween('start_date', [$startDate, $endDate])
//                       ->orWhereBetween('end_date', [$startDate, $endDate])
//                       ->orWhere(function($q) use ($startDate, $endDate) {
//                           $q->where('start_date', '<', $startDate)
//                             ->where('end_date', '>', $endDate);
//                       });
//             })
//             ->get()
//             ->map(function ($leave) {
//                 return [
//                     'id' => $leave->id,
//                     'title' => $leave->user->name . ' - ' . $leave->leave_type,
//                     'start' => $leave->start_date,
//                     'end' => Carbon::parse($leave->end_date)->addDay()->format('Y-m-d'),
//                     'color' => $this->getStatusColor($leave->status),
//                     'status' => $leave->status,
//                     'leave_type' => $leave->leave_type,
//                     'user_name' => $leave->user->name,
//                     'department' => $leave->user->department->name ?? 'N/A',
//                 ];
//             });

//         return response()->json($leaves);
//     }

//     private function getStatusColor($status)
//     {
//         switch (strtolower($status)) {
//             case 'approved':
//                 return '#28a745';
//             case 'pending':
//                 return '#ffc107';
//             case 'rejected':
//                 return '#dc3545';
//             default:
//                 return '#17a2b8';
//         }
//     }

//     public function statusCounts()
//     {
//         $counts = LeaveRequest::selectRaw('status, count(*) as count')
//             ->groupBy('status')
//             ->get()
//             ->mapWithKeys(function ($item) {
//                 return [$item->status => $item->count];
//             });

//         return response()->json($counts);
//     }

//     public function viewReport(Request $request)
//     {
//         $year = $request->input('year', date('Y'));
//         $month = $request->input('month', date('m'));

//         $leaveRequests = LeaveRequest::with('user')
//             ->whereYear('start_date', $year)
//             ->whereMonth('start_date', $month)
//             ->get()
//             ->groupBy('user.department');

//         $leave = Leave::all();

//         $pdf = PDF::loadView('reports.leave', [
//             'leaveRequests' => $leaveRequests,
//             'leaveTypes' => $leave,
//             'year' => $year,
//             'month' => $month
//         ]);

//         return $pdf->stream('leave-report.pdf');
//     }

//     public function page(Request $request)
//     {
//         $year = $request->input('year', date('Y'));
//         $month = $request->input('month', date('m'));

//         $leaveRequests = LeaveRequest::whereYear('start_date', $year)
//             ->whereMonth('start_date', $month)
//             ->get();

//         return response()->json([
//             'status' => 200,
//             'leaveRequests' => $leaveRequests,
//         ]);
//     }

//     public function getLeaveRequests(Request $request)
//     {
//         $year = $request->input('year');
//         $month = $request->input('month');

//         $leaveRequests = LeaveRequest::whereYear('start_date', $year)
//             ->whereMonth('start_date', $month)
//             ->get();

//         return response()->json([
//             'leaveRequests' => $leaveRequests,
//         ]);
//     }

//     public function index()
//     {
//         $leaveRequests = LeaveRequest::all();
//         return response()->json([
//             'status' => 200,
//             'leaveRequests' => $leaveRequests,
//         ]);
//     }

//     public function countLeaveRequests($status)
//     {
//         $count = LeaveRequest::where('status', $status)->count();
//         return response()->json(['count' => $count]);
//     }

//     /**
//      * Store a newly created resource in storage.
//      */
//     public function store(Request $request)
//     {
//         $request->validate([
//             'user_id' => 'required|integer',
//             'name' => 'required|string',
//             'leave_type' => 'required',
//             'start_date' => 'required|date',
//             'end_date' => 'required|date|after_or_equal:start_date',
//             'reason' => 'required|string',
//             'documents' => 'sometimes|array',
//             'document' => 'sometimes|file|mimes:jpg,jpeg,png,pdf,doc,docx,txt|max:500',
//         ]);

//         $type = Leave::where('name', $request->leave_type)->first();
//         $user = User::find($request->user_id);

//         if (!$user) {
//             return response()->json(['message' => 'User not found.'], 404);
//         }

//         $employee = Employee::where('name', $user->name)->first();
//         if (!$employee) {
//             return response()->json(['message' => 'Employee record not found.'], 404);
//         }
//         if (!$type) {
//             return response()->json(['message' => 'Leave type not found.'], 404);
//         }

//         $payroll = Payroll::where('name', $user->name)->first();
//         // if (!$payroll) {
//         //     return response()->json(['message' => 'Payroll record not found for the employee.'], 404);
//         // }

//         if (!$payroll) {
//             $payroll = (object) [
//                 'daily_rate' => 0,
//                 'base_salary' => 0,
//             ];
//         }
//         $payroll = Payroll::where('employee_id', $employee->employee_id)->first();
//         $daily_rate = $payroll->daily_rate ?? 0;

//         $startDate = Carbon::parse($request->start_date);
//         $endDate = Carbon::parse($request->end_date);
//         $total_days = $startDate->diffInDays($endDate) + 1;
//         $month = $startDate->format('m');

//         $is_paid = $type->pay_rate > 0 ? 'Paid' : 'Unpaid';
//         $paid_amount = round($daily_rate * ($type->pay_rate / 100) * $total_days, 2);  0;

//         $filePaths = [];
//         if ($request->hasFile('documents')) {
//             foreach ($request->file('documents') as $file) {
//                 $filePaths[] = $file->store('documents', 'public');
//             }
//         }

//         $leave = LeaveRequest::create([
//             'user_id' => $user->id ?? null,
//             'name' => $user->name,
//             'employee_id' => $employee->employee_id,
//             'leave_type' => $request->leave_type,
//             'start_date' => $request->start_date,
//             'end_date' => $request->end_date,
//             'reason' => $request->reason,
//             'total_days' => $total_days,
//             'status' => 'Pending',
//             'is_paid' => $is_paid,
//             'document_path' => json_encode($filePaths),
//             'month' => $month,
//             'department' => $employee->department,
//             'job_position' => $employee->job_position,
//             'leave_status' => 'Pending',
//             'paid_amount' => $paid_amount,
//         ]);

//         return response()->json([
//             'message' => 'Leave request submitted successfully',
//             'data' => $leave
//         ], 201);
//     }

//     /**
//      * Display the specified resource.
//      */
//     public function show($id)
//     {
//         $leaveRequest = LeaveRequest::find($id);

//         if (!$leaveRequest) {
//             return response()->json([
//                 'message' => 'Leave request not found',
//             ], 404);
//         }

//         return response()->json([
//             'status' => 200,
//             'leaveRequests' => [$leaveRequest],
//         ]);
//     }

//     public function EmployeeInfo($userId)
//     {
//         $leaveRequests = LeaveRequest::where('user_id', $userId)->get();

//         if ($leaveRequests->isEmpty()) {
//             return response()->json([
//                 'message' => 'No leave requests found for this user.',
//                 'leaveRequests' => []
//             ], 200);
//         }

//         return response()->json([
//             'status' => 200,
//             'leaveRequests' => $leaveRequests,
//         ]);
//     }

//     /**
//      * Update the specified resource in storage.
//      */
//     public function update(Request $request, $id)
//     {
//         $leaveRequest = LeaveRequest::find($id);

//         if (!$leaveRequest) {
//             return response()->json([
//                 'message' => 'Leave request not found'
//             ], 404);
//         }

//         $validated = $request->validate([
//             'status' => 'sometimes|in:Pending,Approved,Rejected',
//             'is_paid' => 'sometimes|boolean',
//             'leave_status' => 'sometimes|in:Pending,Approved,Rejected',
//         ]);

//         $leaveRequest->update($validated);

//         return response()->json([
//             'message' => 'Leave request updated successfully',
//             'data' => $leaveRequest
//         ]);

//         $leaveRequest = LeaveRequest::find($id);

//         if (!$leaveRequest) {
//             return response()->json([
//                 'message' => 'Leave request not found'
//             ], 404);
//         }

//         $validated = $request->validate([
//             'status' => 'sometimes|in:Pending,Approved,Rejected',
//             'sometimes|in:Pending,Approved,Rejected',
//             'leave_status' => 'sometimes|in:Pending,Approved,Rejected',
//         ]);

//         if (isset($validated['leave_status']) && $validated['leave_status'] === 'Approved' && $leaveRequest->is_paid === 'Paid') {
//             $employee = Employee::where('name', $leaveRequest->name)->first();
//             $type = Leave::where('name', $leaveRequest->leave_type)->first();

//             if ($employee && $type) {
//                 $payroll = Payroll::where('employee_id', $employee->employee_id)
//                     ->where('month', $leaveRequest->month)
//                     ->first();

//                 if ($payroll) {
//                     $workingDaysInMonth = $this->getWorkingDaysInMonth($leaveRequest->month, date('Y'));
//                     $dailyRate = $payroll->base_salary / $workingDaysInMonth;
//                     $paid_amount = $dailyRate * $leaveRequest->total_days * ($type->pay_rate / 100);

//                     $leaveRequest->paid_amount = $paid_amount;
//                 }
//             }
//         }

//         $leaveRequest->update($validated);

//         return response()->json([
//             'message' => 'Leave request updated successfully',
//             'data' => $leaveRequest
//         ]);
//     }

//     /**
//      * Remove the specified resource from storage.
//      */
//     public function destroy(string $id)
//     {
//         $leaveRequest = LeaveRequest::findOrFail($id);
//         $leaveRequest->delete();

//         return response()->json([
//             'message' => 'Leave request deleted successfully',
//         ]);
//     }

//     public function getLeaveStatistics()
//     {
//         $leaveRequests = LeaveRequest::all();

//         $statistics = [
//             'total_leave_requests' => $leaveRequests->count(),
//             'total_paid_leave' => $leaveRequests->where('is_paid', 'Paid')->count(),
//             'total_unpaid_leave' => $leaveRequests->where('is_paid', 'Unpaid')->count(),
//             'total_approved_leave' => $leaveRequests->where('status', 'Approved')->count(),
//             'total_rejected_leave' => $leaveRequests->where('status', 'Rejected')->count(),
//             'leave_types' => $leaveRequests->groupBy('leave_type')->map->count(),
//         ];

//         return response()->json($statistics);
//     }

//     // public function generateReport(Request $request)
//     // {
//     //     $year = $request->input('year');
//     //     $month = $request->input('month');
//     //     $leaveRequests = LeaveRequest::whereYear('start_date', $year)
//     //         ->whereMonth('start_date', $month)
//     //         ->get();
//     //     $groupedLeaveRequests = $leaveRequests->groupBy('department');
//     //     $pdf = PDF::loadView('leave_report', [
//     //         'leaveRequests' => $groupedLeaveRequests,
//     //         'year' => $year,
//     //         'month' => $month,
//     //     ]);
//     //     return $pdf->download("leave-report-{$year}-{$month}.pdf");
//     // }

//     // public function leaveView(Request $request)
//     // {
//     //     $year = $request->input('year');
//     //     $month = $request->input('month');

//     //     if (!$year || !$month) {
//     //         return response()->json(['error' => 'Year and month parameters are required'], 400);
//     //     }

//     //     $leaveRequests = LeaveRequest::whereYear('start_date', $year)
//     //         ->whereMonth('start_date', $month)
//     //         ->get();

//     //     if ($leaveRequests->isEmpty()) {
//     //         return response()->json(['error' => 'No leave requests found for the selected period'], 404);
//     //     }

//     //     $groupedLeaveRequests = $leaveRequests->groupBy('department');

//     //     $pdf = PDF::loadView('leave_report', [
//     //         'leaveRequests' => $groupedLeaveRequests,
//     //         'year' => $year,
//     //         'month' => $month,
//     //     ]);

//     //     return $pdf->stream("leave.leave-report-{$year}-{$month}.pdf");
//     // }

//     public function leaveView(Request $request)
// {
//     $year = $request->input('year', date('Y'));
//     $month = $request->input('month', date('m'));

//     $leaveRequests = LeaveRequest::whereYear('start_date', $year)
//         ->whereMonth('start_date', $month)
//         ->get()
//         ->groupBy('department');

//     if ($leaveRequests->isEmpty()) {
//         return response()->json(['error' => 'No leave requests found.'], 404);
//     }

//     $pdf = PDF::loadView('leave.leave_report', [
//         'leaveRequests' => $leaveRequests,
//         'year' => $year,
//         'month' => $month,
//     ]);

//     return $pdf->stream('leave-report.pdf');
// }

//     public function getLeaveTypes()
//     {
//         $leaveTypes = Leave::all();
//         return response()->json($leaveTypes);
//     }

//     // public function generateReport(Request $request)
//     // {
//     //     $request->validate([
//     //         'year' => 'required|integer|min:2000|max:2100',
//     //         'month' => 'required|integer|min:1|max:12',
//     //     ]);

//     //     $year = $request->input('year');
//     //     $month = $request->input('month');

//     //     $leaveRequests = LeaveRequest::where(function($query) use ($year, $month) {
//     //             $query->whereYear('start_date', $year)
//     //                   ->whereMonth('start_date', $month);
//     //         })
//     //         ->orWhere(function($query) use ($year, $month) {
//     //             $query->whereYear('end_date', $year)
//     //                   ->whereMonth('end_date', $month);
//     //         })
//     //         ->with('user')
//     //         ->get()
//     //         ->groupBy('department');

//     //     $data = [
//     //         'year' => $year,
//     //         'month' => $month,
//     //         'monthName' => date('F', mktime(0, 0, 0, $month, 1)),
//     //         'leaveRequests' => $leaveRequests,
//     //     ];
//     //     $pdf = PDF::loadView('leave.leave_report', $data);

//     //     return $pdf->download("leave-report-{$year}-{$month}.pdf");
//     // }

//     public function generateReport(Request $request)
//     {
//         $request->validate([
//             'year' => 'required|integer|min:2000|max:2100',
//             'month' => 'required|integer|min:1|max:12',
//         ]);

//         $year = $request->input('year');
//         $month = $request->input('month');

//         $autoPassword = $month . '/' . $year;
//         if ($request->input('password') !== $autoPassword) {
//             return response()->json(['error' => 'Invalid password'], 401);
//         }

//         $leaveRequests = LeaveRequest::where(function($query) use ($year, $month) {
//                 $query->whereYear('start_date', $year)
//                       ->whereMonth('start_date', $month);
//             })
//             ->orWhere(function($query) use ($year, $month) {
//                 $query->whereYear('end_date', $year)
//                       ->whereMonth('end_date', $month);
//             })
//             ->with('user')
//             ->get()
//             ->groupBy('department');

//         $data = [
//             'year' => $year,
//             'month' => $month,
//             'monthName' => date('F', mktime(0, 0, 0, $month, 1)),
//             'leaveRequests' => $leaveRequests,
//         ];

//         $pdf = PDF::loadView('leave.leave_report', $data);

//         $pdf->setEncryption($autoPassword, '', ['copy', 'print'], 128);

//         return $pdf->download("leave-report-{$year}-{$month}.pdf");
//     }

// }
