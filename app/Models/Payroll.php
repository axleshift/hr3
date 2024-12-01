<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payroll extends Model
{
    use HasFactory;
    protected $table = 'payrolls';

    protected $fillable = [
        'employeeId',
        'employeeName',
        'basicSalary',
        'overtime',
        'benefits',
        'deductions',
        'bonus',
        'netSalary',
        'hoursWorked',
        'paymentMethod',
        'accountNumber',
        'status',
        // 'note',
    ];
}