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
        'name',
        'department',
        'job_position',
        'base_salary',
        'daily_rate',
        'gross_salary',
        'net_salary',
        'total_regular_hours',
        'total_overtime_hours',
        'total_late_hours',
        'total_undertime_hours',
        'total_overtime_amount',
        'year',
        'working_days',
        'monthly_rate',
        'period',
        'month',
        'tax',
        'bonus',
        'deduction',
        'benefits_total',
        'paid_leave_amount',
        'pay_period',
        'status',
        'user_id',
        'start_date',
        'end_date',
        'days_worked',
        'month',
        'year',
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