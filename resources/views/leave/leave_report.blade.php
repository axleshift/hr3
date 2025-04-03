<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Leave Report - {{ $monthName }} {{ $year }}</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .header { text-align: center; margin-bottom: 20px; }
        .header h1 { margin: 0; }
        .header p { margin: 5px 0 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; }
        th { 
            background-color: #f2f2f2; 
            text-align: center; /* Center-align all th elements */
        }
        td { text-align: left; } /* Keep td elements left-aligned */
        .department-header { background-color: #e9e9e9; font-weight: bold; }
        .footer { margin-top: 30px; text-align: right; font-size: 0.8em; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Leave Report</h1>
        <p>{{ $monthName }} {{ $year }}</p>
    </div>

    @foreach($leaveRequests as $department => $leaves)
        <h3>{{ $department }} Department</h3>
        <table>
            <thead>
                <tr>
                    <th>Employee</th>
                    <th>Leave Type</th>
                    <th>Duration</th>
                    <th>Days</th>
                    <th>Reason</th>
                    <th>Paid</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                @foreach($leaves as $leave)
                <tr>
                    <td>{{ $leave->user->name }}</td>
                    <td>{{ $leave->leave_type }}</td>
                    <td>{{ date('M d, Y', strtotime($leave->start_date)) }} - {{ date('M d, Y', strtotime($leave->end_date)) }}</td>
                    <td>{{ $leave->total_days }}</td>
                    <td>{{ $leave->reason }}</td>
                    <td>{{ $leave->is_paid }}</td>
                    <td>{{ $leave->status }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    @endforeach

    <div class="footer">
        Generated on {{ date('M d, Y') }}
    </div>
</body>
</html>