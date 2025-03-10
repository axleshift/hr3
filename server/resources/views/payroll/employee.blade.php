<!DOCTYPE html>
<html>
<head>
    <title>Employee Payslip</title>
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
    </style>
</head>
<body>
    <div class="payslip">
        <div class="header">
            <h1>Employee Payslip</h1>
        </div>
        
        <div class="sub-header">
            <p><strong>Pay Period:</strong> {{ $payslipData['periodStart'] }} – {{ $payslipData['periodEnd'] }}</p>
            <p><strong>Pay Date:</strong> {{ $payslipData['dateIssued'] }}</p>
        </div>

        <div class="details">
            <p><strong>Employee Name:</strong> {{ $payslipData['employeeName'] }}</p>
            <p><strong>Employee ID:</strong> {{ $payslipData['employeeId'] }}</p>
            <p><strong>Position:</strong> {{ $payslipData['job_position'] }}</p>
        </div>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Earnings</th>
                        <th>Amount</th>
                        <th>Deductions</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Earnings -->
                    <tr>
                        <td>Basic Salary</td>
                        <td>{{ number_format($payslipData['netSalary'] - $payslipData['overtime'] - $payslipData['bonus'], 2) }}</td>
                        <td>Benefits</td>
                        <td>{{ number_format($payslipData['deductions'], 2) }}</td>
                    </tr>
                    <tr>
                        <td>Overtime Pay</td>
                        <td>{{ number_format($payslipData['overtime'], 2) }}</td>
                    </tr>
                    <tr>
                        <td>Bonus</td>
                        <td>{{ number_format($payslipData['bonus'], 2) }}</td>
                    </tr>
                    <tr>
                        <td>Total Earnings</td>
                        <td class="highlight">{{ number_format($payslipData['netSalary'] + $payslipData['deductions'], 2) }}</td>
                        <td>Total Deductions</td>
                        <td class="highlight">{{ number_format($payslipData['deductions'] + $payslipData['benefits']['health_insurance'], 2) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="table-container">
            <table>
                <tr>
                    <th>Net Pay</th>
                    <td class="total">{{ number_format($payslipData['netSalary'], 2) }}</td>
                </tr>
            </table>
        </div>

        <div class="footer">
            <p>Thank you for your hard work!</p>
        </div>
    </div>
</body>
</html>