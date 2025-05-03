<!DOCTYPE html>
<html>
<head>
    <title>Two-Factor Authentication Code</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #202124;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .header {
            padding: 20px;
            text-align: center;
            border-bottom: 1px solid #e0e0e0;
        }
        .logo {
            height: 40px;
        }
        .content {
            padding: 20px 40px;
        }
        h1 {
            font-size: 20px;
            color: #202124;
            margin-top: 0;
        }
        .code-container {
            text-align: center;
            margin: 30px 0;
        }
        .code {
            display: inline-block;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 5px;
            color: #1a73e8;
            padding: 15px 20px;
            background-color: #f1f3f4;
            border-radius: 4px;
        }
        .footer {
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #5f6368;
            border-top: 1px solid #e0e0e0;
        }
        .button {
            display: inline-block;
            background-color: #1a73e8;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            margin: 20px 0;
        }
        .note {
            font-size: 14px;
            color: #5f6368;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="{{ $message->embed(public_path('favicon.png')) }}" alt="{{ config('app.name') }}" class="logo">
        </div>
        
        <div class="content">
            <h1>Verify your login</h1>
            <p>We received a request to sign in to your account with 2-step verification.</p>
            
            <div class="code-container">
                <p>Use this verification code:</p>
                <div class="code">{{ $token }}</div>
                <p>This code will expire in 10 minutes.</p>
            </div>
            
            <p>If you didn't request this code, you can safely ignore this email.</p>
            
            <div class="note">
                <p>You received this email to let you know about important changes to your account security.</p>
            </div>
        </div>
        
        <div class="footer">
            <p>© 2025 {{ config('app.name') }}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>