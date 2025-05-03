<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payslip extends Model
{
    use HasFactory;

    protected $table = 'payslips';
    protected $fillable = [
        'employee_id',
        'user_id',
        'month',
        'year',
        'net_salary',
        'base_salary',
        'bonus',
        'deduction',
        'status',
        'name',
        'total_overtime_amount',
        'department',
        'job_position',
        'issued_at',
        'password',
        'tax',
        'benefits_total',
        'pdf_path'
    ];

    // public function payroll()
    // {
    //     return $this->belongsTo(Payroll::class, 'employee_id', 'employee_id');
    // }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
