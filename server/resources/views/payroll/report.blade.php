<!DOCTYPE html>
<html>
<head>
    <title>Payroll Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .department-header {
            background-color: #e0e0e0;
            padding: 10px;
            margin-top: 20px;
            font-weight: bold;
        }
        .grand-total {
            text-align: right;
            font-weight: bold;
            font-size: 1.2em;
            margin-top: 20px;
            padding: 10px;
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>
    <h1>Payroll Report for {{ $month }}/{{ $year }}</h1>

    @php
        $grandTotal = 0;
    @endphp

    @foreach ($payrollData as $department => $employees)
        @php
            $departmentTotal = $employees->sum('net_salary');
            $grandTotal += $departmentTotal;
        @endphp
        
        <div class="department-header">
            Department: {{ $department }}
        </div>
        <table>
            <thead>
                <tr>
                    <th>Employee Name</th>
                    <th>Base Salary</th>
                    <th>Overtime</th>
                    <th>Bonus</th>
                    <th>Deduction</th>
                    <th>Net Salary</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($employees as $employee)
                    <tr>
                        <td>{{ $employee->name }}</td>
                        <td>{{ number_format($employee->base_salary, 2) }}</td>
                        <td>{{ number_format($employee->total_overtime_amount, 2) }}</td>
                        <td>{{ number_format($employee->bonus, 2) }}</td>
                        <td>{{ number_format($employee->deduction, 2) }}</td>
                        <td>{{ number_format($employee->net_salary, 2) }}</td>
                    </tr>
                @endforeach
            </tbody>
            <tfoot>
                <tr>
                    <th colspan="5" style="text-align: right;">Department Total:</th>
                    <th>{{ number_format($departmentTotal, 2) }}</th>
                </tr>
            </tfoot>
        </table>
    @endforeach

    <div class="grand-total">
        Grand Total: {{ number_format($grandTotal, 2) }}
    </div>
</body>
</html>