<!DOCTYPE html>
<html>
<head>
    <title>Payslip - {{ $payslip->name }}</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .header { text-align: center; margin-bottom: 20px; }
        .details { margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .section { margin-bottom: 15px; }
        .signature { margin-top: 50px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>PAYSLIP</h1>
        <h3>{{ date('F Y', strtotime($payslip->start_date)) }}</h3>
    </div>
    
    <div class="details">
        <p><strong>Employee ID:</strong> {{ $payslip->employee_id }}</p>
        <p><strong>Name:</strong> {{ $payslip->name }}</p>
        <p><strong>Department:</strong> {{ $payslip->department }}</p>
        <p><strong>Position:</strong> {{ $payslip->job_position }}</p>
        <p><strong>Pay Period:</strong> {{ $payslip->start_date }} to {{ $payslip->end_date }}</p>
    </div>
    
    <div class="section">
        <h3>Earnings</h3>
        <table>
            <tr>
                <th>Description</th>
                <th>Amount</th>
            </tr>
            <tr>
                <td>Base Salary</td>
                <td>{{ number_format($payslip->base_salary, 2) }}</td>
            </tr>
            <tr>
                <td>Overtime Pay</td>
                <td>{{ number_format($payslip->total_overtime_amount, 2) }}</td>
            </tr>
            <tr>
                <td>Bonus</td>
                <td>{{ number_format($payslip->bonus, 2) }}</td>
            </tr>
            <tr>
                <td><strong>Gross Salary</strong></td>
                <td><strong>{{ number_format($payslip->gross_salary, 2) }}</strong></td>
            </tr>
        </table>
    </div>
    
    <div class="section">
        <h3>Deductions</h3>
        <table>
            <tr>
                <th>Description</th>
                <th>Amount</th>
            </tr>
            <tr>
                <td>Tax</td>
                <td>{{ number_format($payslip->tax, 2) }}</td>
            </tr>
            <tr>
                <td>Other Deductions</td>
                <td>{{ number_format($payslip->deduction, 2) }}</td>
            </tr>
        </table>
    </div>
    
    <div class="section">
        <h3>Summary</h3>
        <table>
            <tr>
                <td><strong>Net Salary</strong></td>
                <td><strong>{{ number_format($payslip->net_salary, 2) }}</strong></td>
            </tr>
        </table>
    </div>
    
    <div class="signature">
        <p>_________________________</p>
        <p>Authorized Signature</p>
    </div>
</body>
</html>