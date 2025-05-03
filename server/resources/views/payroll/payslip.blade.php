
<!DOCTYPE html>
<html>
<head>
    <title>Payslip - {{ $payroll->name }}</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .header { text-align: center; margin-bottom: 20px; }
        .employee-info { margin-bottom: 20px; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .table th { background-color: #f2f2f2; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .total-row { font-weight: bold; }
        .footer { margin-top: 30px; font-size: 0.9em; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <h2>{{ config('app.name') }}</h2>
        <h3>Payslip for {{ $monthName }} {{ $year }}</h3>
    </div>

    <div class="employee-info">
        <p><strong>Employee:</strong> {{ $payroll->name }}</p>
        <p><strong>Employee ID:</strong> {{ $payroll->employee_id }}</p>
        <p><strong>Department:</strong> {{ $payroll->department }}</p>
        <p><strong>Position:</strong> {{ $payroll->job_position }}</p>
        <p><strong>Pay Period:</strong> 
            {{ \Carbon\Carbon::parse($payroll->start_date)->format('M d, Y') }} - 
            {{ \Carbon\Carbon::parse($payroll->end_date)->format('M d, Y') }}
        </p>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>Earnings</th>
                <th>Amount</th>
                <th>Deductions</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Base Salary</td>
                <td class="text-right">{{ number_format($payroll->base_salary, 2) }}</td>
                <td>Tax</td>
                <td class="text-right">{{ number_format($payroll->tax, 2) }}</td>
            </tr>
            <tr>
                <td>Overtime Pay</td>
                <td class="text-right">{{ number_format($payroll->total_overtime_amount, 2) }}</td>
                <td>Benefits</td>
                <td class="text-right">{{ number_format($payroll->benefits_total, 2) }}</td>
            </tr>
            <tr>
                <td>Bonus</td>
                <td class="text-right">{{ number_format($payroll->bonus, 2) }}</td>
                <td>Late Deductions</td>
                <td class="text-right">{{ number_format($payroll->total_late_hours * ($payroll->daily_rate / 8), 2) }}</td>
            </tr>
            <tr>
                <td>Paid Leave</td>
                <td class="text-right">{{ number_format($payroll->paid_leave_amount, 2) }}</td>
                <td></td>
                <td></td>
            </tr>
            <tr class="total-row">
                <td><strong>Total Earnings</strong></td>
                <td class="text-right"><strong>{{ number_format($payroll->gross_salary, 2) }}</strong></td>
                <td><strong>Total Deductions</strong></td>
                <td class="text-right"><strong>{{ number_format($payroll->tax + $payroll->benefits_total + ($payroll->total_late_hours * ($payroll->daily_rate / 8)), 2) }}</strong></td>
            </tr>
            <tr class="total-row">
                <td colspan="3"><strong>Net Pay</strong></td>
                <td class="text-right"><strong>{{ number_format($payroll->net_salary, 2) }}</strong></td>
            </tr>
        </tbody>
    </table>

    <div class="footer">
        <p>This payslip was generated on {{ now()->format('M d, Y H:i') }}</p>
        <p>If you have any questions, please contact HR.</p>
    </div>
</body>
</html>
