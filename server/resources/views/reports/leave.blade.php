<!DOCTYPE html>
<html>
<head>
    <title>Leave Report - {{ $month }}/{{ $year }}</title>
    <style>
        body { font-family: Arial, sans-serif; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .department-header { background-color: #e9e9e9; font-weight: bold; }
        .text-center { text-align: center; }
        .badge { padding: 3px 6px; border-radius: 3px; font-size: 12px; }
        .badge-success { background-color: #28a745; color: white; }
        .badge-danger { background-color: #dc3545; color: white; }
        .badge-warning { background-color: #ffc107; color: black; }
        .badge-secondary { background-color: #6c757d; color: white; }
    </style>
</head>
<body>
    <h1>Leave Report - {{ date('F', mktime(0, 0, 0, $month, 1)) }} {{ $year }}</h1>
    
    <table>
        <thead>
            <tr>
                <th>Employee</th>
                <th class="text-center">Department</th>
                <th class="text-center">Leave Type</th>
                <th class="text-center">Duration</th>
                <th class="text-center">Days</th>
                <th class="text-center">Status</th>
                <th class="text-center">Paid</th>
                <th class="text-center">Reason</th>
            </tr>
        </thead>
        <tbody>
            @foreach($leaveRequests as $department => $leaves)
                <tr>
                    <td colspan="8" class="department-header">{{ $department }} Department</td>
                </tr>
                @foreach($leaves as $leave)
                <tr>
                    <td>{{ $leave->user->name }}</td>
                    <td class="text-center">{{ $department }}</td>
                    <td class="text-center">{{ $leave->leave_type }}</td>
                    <td class="text-center">
                        {{ $leave->start_date->format('m/d/Y') }} - {{ $leave->end_date->format('m/d/Y') }}
                    </td>
                    <td class="text-center">{{ $leave->total_days }}</td>
                    <td class="text-center">
                        @if($leave->status === 'Approved')
                            <span class="badge badge-success">Approved</span>
                        @elseif($leave->status === 'Rejected')
                            <span class="badge badge-danger">Rejected</span>
                        @else
                            <span class="badge badge-warning">Pending</span>
                        @endif
                    </td>
                    <td class="text-center">
                        @if($leave->is_paid === 'Paid')
                            <span class="badge badge-success">Paid</span>
                        @else
                            <span class="badge badge-secondary">Unpaid</span>
                        @endif
                    </td>
                    <td class="text-center">{{ $leave->reason }}</td>
                </tr>
                @endforeach
            @endforeach
        </tbody>
    </table>
</body>
</html>