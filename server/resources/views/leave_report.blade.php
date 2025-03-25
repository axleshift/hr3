<!DOCTYPE html>
<html>
<head>
    <title>Leave Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .department-header {
            background-color: #f8f9fa;
            font-weight: bold;
            font-size: 1.1em;
            padding: 10px;
        }
    </style>
</head>
<body>
    <h1>Leave Report - {{ $month }}/{{ $year }}</h1>

    @foreach ($leaveRequests as $department => $leaves)
        <div class="department-header">
            Department: {{ $department }}
        </div>
        <table>
            <thead>
                <tr>
                    <th>Employee Name</th>
                    <th>Leave Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th>Total Days</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($leaves as $leave)
                    <tr>
                        <td>{{ $leave->name }}</td>
                        <td>{{ $leave->leave_type }}</td>
                        <td>{{ $leave->start_date }}</td>
                        <td>{{ $leave->end_date }}</td>
                        <td>{{ $leave->status }}</td>
                        <td>{{ $leave->total_days }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
        <br>
    @endforeach
</body>
</html>