<!DOCTYPE html>
<html>
<head>
    <title>All Payslips</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
        }
        .payslip {
            width: 100%;
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
            background: #fff;
            border: 1px solid #ddd;
            box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
            page-break-after: always;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .header h1 {
            font-size: 20px;
            margin: 0;
        }
        .sub-header {
            text-align: center;
            font-size: 14px;
            margin-top: 5px;
        }
        .details {
            margin-bottom: 20px;
        }
        .details p {
            margin: 5px 0;
            font-size: 14px;
        }
        .table-container {
            width: 100%;
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            font-size: 14px;
        }
        th {
            background-color: #f4f4f4;
            text-align: left;
        }
        .highlight {
            font-weight: bold;
        }
        .total {
            font-size: 16px;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
    </style>
</head>
<body>
    @foreach($payslips as $payslipData)
        <div class="payslip">
            <div class="header">
                <h1>Payslip</h1>
                <div class="sub-header">
                    <p><strong>Company Name</strong></p>
                    <p><strong>Pay Period:</strong> {{ date('F d, Y', strtotime($payslipData['start_date'])) }} – {{ date('F d, Y', strtotime($payslipData['end_date'])) }}</p>
                    <p><strong>Date Issued:</strong> {{ date('F d, Y', strtotime($payslipData['issued_at'])) }}</p>
                </div>
            </div>

            <div class="details">
                <div style="display: flex; justify-content: space-between;">
                    <div>
                        <p><strong>Employee Name:</strong> {{ $payslipData['name'] }}</p>
                        <p><strong>Employee ID:</strong> {{ $payslipData['employee_id'] }}</p>
                        <p><strong>Department:</strong> {{ $payslipData['department'] }}</p>
                    </div>
                    <div>
                        <p><strong>Position:</strong> {{ $payslipData['job_position'] }}</p>
                        <p><strong>Status:</strong> {{ $payslipData['status'] }}</p>
                        <p><strong>Working Days:</strong> {{ $payslipData['working_days'] }}</p>
                    </div>
                </div>
            </div>

            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Earnings</th>
                            <th>Hours</th>
                            <th>Amount</th>
                            <th>Deductions</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Base Salary</td>
                            <td class="text-center">{{ $payslipData['total_regular_hours'] }}</td>
                            <td class="text-right">{{ number_format($payslipData['base_salary'], 2) }}</td>
                            <td>Tax</td>
                            <td class="text-right">{{ number_format($payslipData['tax'], 2) }}</td>
                        </tr>
                        <tr>
                            <td>Overtime Pay</td>
                            <td class="text-center">{{ $payslipData['total_overtime_hours'] }}</td>
                            <td class="text-right">{{ number_format($payslipData['total_overtime_amount'], 2) }}</td>
                            <td>Benefits</td>
                            <td class="text-right">{{ number_format($payslipData['benefits_total'], 2) }}</td>
                        </tr>
                        <tr>
                            <td>Bonus</td>
                            <td class="text-center">-</td>
                            <td class="text-right">{{ number_format($payslipData['bonus'], 2) }}</td>
                            <td>Late Hours</td>
                            <td class="text-right">{{ number_format($payslipData['total_late_hours'], 2) }}</td>
                        </tr>
                        <tr>
                            <td>Paid Leave</td>
                            <td class="text-center">-</td>
                            <td class="text-right">{{ number_format($payslipData['paid_leave_amount'], 2) }}</td>
                            <td></td>
                            <td></td>
                        </tr>
                        
                        @if(isset($payslipData['benefits']) && is_array($payslipData['benefits']))
                            @foreach($payslipData['benefits'] as $benefit)
                            <tr>
                                <td colspan="3"></td>
                                <td>{{ $benefit['type'] }}</td>
                                <td class="text-right">{{ number_format($benefit['amount'], 2) }}</td>
                            </tr>
                            @endforeach
                        @endif
                        
                        <tr class="highlight">
                            <td colspan="2">Gross Salary</td>
                            <td class="text-right">{{ number_format($payslipData['gross_salary'], 2) }}</td>
                            <td>Total Deductions</td>
                            <td class="text-right">{{ number_format($payslipData['tax'] + $payslipData['benefits_total'] + $payslipData['total_late_hours'], 2) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="table-container">
                <table>
                    <tr>
                        <th>Net Pay</th>
                        <td class="total text-right">
                            {{ number_format($payslipData['net_salary'], 2) }}
                        </td>
                    </tr>
                </table>
            </div>

            <div class="footer">
                <p>This is a computer generated payslip and does not require signature</p>
                <p>Thank you for your hard work!</p>
            </div>
        </div>
    @endforeach
</body>
</html>