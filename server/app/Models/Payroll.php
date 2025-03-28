<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payroll extends Model
{
    use HasFactory;
    protected $table = 'payrolls';

    protected $fillable = [
        'employee_id',
        'user_id',
        'name',
        'total_regular_hours',
        'total_undertime_hours',
        'total_overtime_hours',
        'total_overtime_amount',
        'net_salary',
        'year',
        'month',
        'bonus',
        'benefits_total',
        'base_salary',
        'department',
        'job_position',
        'daily_rate',
        'gross_salary',
        'tax',
        'paid_leave_amount'
    ];

    public function payslip()
    {
        return $this->belongsTo(Payslip::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'employee_id');
    }
}