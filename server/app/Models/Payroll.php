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
        'total_regular_hours',
        'total_undertime_hours',
        'total_overtime_hours',
        'total_overtime_amount',
        'net_salary',
        'year',
        'month',
        'bonus',
        'deduction',
    ];
}