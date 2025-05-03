<!DOCTYPE html>
<html>
<head>
    <title>Your Payslip</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 20px; }
        .details { margin-bottom: 20px; }
        .footer { margin-top: 30px; font-size: 0.9em; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h2>{{ config('app.name') }}</h2>
        <h3>Payslip for {{ date('F Y', mktime(0, 0, 0, $payslip->month, 1, $payslip->year)) }}</h3>
    </div>

    <div class="details">
        <p><strong>Employee:</strong> {{ $payslip->name }}</p>
        <p><strong>Employee ID:</strong> {{ $payslip->employee_id }}</p>
        <p><strong>Department:</strong> {{ $payslip->department }}</p>
        <p><strong>Position:</strong> {{ $payslip->job_position }}</p>
        <p><strong>Pay Period:</strong> 
            {{ \Carbon\Carbon::parse($payslip->start_date)->format('M d, Y') }} - 
            {{ \Carbon\Carbon::parse($payslip->end_date)->format('M d, Y') }}
        </p>
    </div>

    <p>Please find attached your payslip for the above period.</p>

    <div class="footer">
        <p>This is an automated message. Please do not reply directly to this email.</p>
        <p>If you have any questions about your payslip, please contact HR.</p>
    </div>
</body>
</html>