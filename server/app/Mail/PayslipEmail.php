<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Payslip;

class PayslipEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $payslip;
    public $pdfPath;
    public $password;

    public function __construct(Payslip $payslip, $pdfPath, $password)
    {
        $this->payslip = $payslip;
        $this->pdfPath = $pdfPath;
        $this->password = $password;
    }

    public function build()
    {
        return $this->subject('Your Secure Payslip - ' . date('F Y', mktime(0, 0, 0, $this->payslip->month, 1, $this->payslip->year)))
                    ->view('emails.secure_payslip')
                    ->attach($this->pdfPath, [
                        'as' => 'payslip-' . $this->payslip->employee_id . '.pdf',
                        'mime' => 'application/pdf',
                    ]);
    }
}