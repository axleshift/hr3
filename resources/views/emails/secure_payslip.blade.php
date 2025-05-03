
<!DOCTYPE html>
<html>
<head>
    <title>Your Secure Payslip</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 20px; }
        .details { margin-bottom: 20px; }
        .password-box { 
            background-color: #f8f9fa; 
            border: 1px solid #dee2e6;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
            font-family: monospace;
            font-size: 1.2em;
            text-align: center;
        }
        .footer { margin-top: 30px; font-size: 0.9em; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h2>{{ config('app.name') }}</h2>
        <h3>Secure Payslip for {{ date('F Y', mktime(0, 0, 0, $payslip->month, 1, $payslip->year)) }}</h3>
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

    <p>Please find attached your password-protected payslip for the above period.</p>
    
    <p>To open the PDF file, you will need the following password:</p>
    
    <div class="password-box">
        {{ $password }}
    </div>
    
    <p><strong>Important:</strong> 
        <ul>
            <li>This password is unique to this payslip</li>
            <li>The PDF will not display any content without the password</li>
            <li>Do not share this password with anyone</li>
            <li>The password will be required each time you open the file</li>
        </ul>
    </p>

    <div class="footer">
        <p>This is an automated message. Please do not reply directly to this email.</p>
        <p>If you have any questions about your payslip, please contact HR.</p>
    </div>
</body>
</html>
