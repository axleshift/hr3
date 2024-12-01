<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payslip</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body>
<div class="container mt-5">
    <div class="card">
        <div class="card-header text-center">
            <h2>Payslip</h2>
            <p>Pay Period: {{ $payslip['periodStart'] }} to {{ $payslip['periodEnd'] }}</p>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col-md-6">
                    <p><strong>Name:</strong> {{ $payslip['employeeName'] }}</p>
                </div>
                <div class="col-md-6">
                    <p><strong>Date Issued:</strong> {{ $payslip['dateIssued'] }}</p>
                    <p><strong>Position:</strong> Software Developer</p>
                </div>
            </div>

            <!-- Earnings Table -->
            <h4 class="mt-4">Earnings</h4>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Details</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Basic Salary</td>
                        <td>${{ number_format($payslip['basicSalary'], 2) }}</td>
                    </tr>
                    <tr>
                        <td>Overtime</td>
                        <td>${{ number_format($payslip['overtime'], 2) }}</td>
                    </tr>
                    <tr>
                        <td>Bonus</td>
                        <td>${{ number_format($payslip['bonus'], 2) }}</td>
                    </tr>
                    <tr>
                        <td>Benefits</td>
                        <td>${{ number_format($payslip['benefits'], 2) }}</td>
                    </tr>
                </tbody>
            </table>

            <!-- Deductions Table -->
            <h4 class="mt-4">Deductions</h4>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Details</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Total Deductions</td>
                        <td>-${{ number_format($payslip['deductions'], 2) }}</td>
                    </tr>
                </tbody>
            </table>

            <!-- Net Salary -->
            <div class="text-right mt-4">
                <h4><strong>Net Salary:</strong> ${{ number_format($payslip['netSalary'], 2) }}</h4>
            </div>
        </div>
    </div>
</div>
</body>
</html>
