<!DOCTYPE html>
<html>
<head>
    <title>Leave Report - {{ date('F', mktime(0, 0, 0, $month, 1)) }} {{ $year }}</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
        th { background-color: #f2f2f2; }
        .header { text-align: center; margin-bottom: 20px; }
        .section-title { background-color: #e0e0e0; font-weight: bold; padding: 5px; margin: 15px 0 5px 0; }
        .department-header { background-color: #f0f0f0; font-weight: bold; }
        .badge { padding: 2px 5px; border-radius: 3px; font-size: 11px; }
        .badge-approved { background-color: #d4edda; color: #155724; }
        .badge-pending { background-color: #fff3cd; color: #856404; }
        .badge-rejected { background-color: #f8d7da; color: #721c24; }
        .badge-paid { background-color: #d4edda; color: #155724; }
        .badge-unpaid { background-color: #e2e3e5; color: #383d41; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Leave Report</h1>
        <h2>{{ date('F', mktime(0, 0, 0, $month, 1)) }} {{ $year }}</h2>
    </div>

    <!-- Employee Leave Balances -->
    <div class="section-title">Employee Leave Balances</div>
    <table>
        <thead>
            <tr>
                <th>Employee ID</th>
                <th>Employee</th>
                <th>Department</th>
                @foreach($leaveTypes as $type)
                    <th>{{ $type->name }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @foreach($employeeBalances as $employee)
                <tr>
                    <td>{{ $employee['employee_id'] }}</td>
                    <td>{{ $employee['name'] }}</td>
                    <td>{{ $employee['department'] }}</td>
                    @foreach($leaveTypes as $type)
                        @php $balance = $employee['types'][$type->name] ?? ['used' => 0, 'remaining' => 0]; @endphp
                        <td>
                            <div>Used: {{ $balance['used'] }}</div>
                            <div>Remaining: {{ $balance['remaining'] }}</div>
                            @if($type->leave_balance)
                                <div>Total: {{ $type->leave_balance }}</div>
                            @endif
                        </td>
                    @endforeach
                </tr>
            @endforeach
        </tbody>
    </table>

    <!-- Leave Summary by Type -->
    <div class="section-title">Leave Summary by Type</div>
    <table>
        <thead>
            <tr>
                <th>Leave Type</th>
                <th>Total Days Taken</th>
                <th>Paid/Unpaid</th>
            </tr>
        </thead>
        <tbody>
            @foreach($leaveSummary as $summary)
                <tr>
                    <td>{{ $summary['name'] }}</td>
                    <td>{{ $summary['totalDays'] }}</td>
                    <td>Paid: {{ $summary['paidCount'] }}, Unpaid: {{ $summary['unpaidCount'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <!-- Detailed Leave Records -->
    <div class="section-title">Detailed Leave Records</div>
    @foreach($leaveRequests as $department => $leaves)
        <div class="department-header">{{ $department }} Department</div>
        <table>
            <thead>
                <tr>
                    <th>Employee</th>
                    <th>Leave Type</th>
                    <th>Dates</th>
                    <th>Days</th>
                    <th>Status</th>
                    <th>Paid</th>
                    <th>Reason</th>
                </tr>
            </thead>
            <tbody>
                @foreach($leaves as $leave)
                    <tr>
                        <td>{{ $leave->name }}</td>
                        <td>{{ $leave->leave_type }}</td>
                        <td>{{ \Carbon\Carbon::parse($leave->start_date)->format('m/d/Y') }} - 
                            {{ \Carbon\Carbon::parse($leave->end_date)->format('m/d/Y') }}</td>
                        <td>{{ $leave->total_days }}</td>
                        <td>
                            <span class="badge badge-{{ strtolower($leave->status) }}">
                                {{ $leave->status }}
                            </span>
                        </td>
                        <td>
                            <span class="badge badge-{{ strtolower($leave->is_paid) }}">
                                {{ $leave->is_paid }}
                            </span>
                        </td>
                        <td>{{ $leave->reason }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endforeach
</body>
</html>