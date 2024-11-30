<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Deduction extends Model
{
    use HasFactory;

    protected $table = 'deductions';

    protected $fillable = [
        'employeeId',
        'employeeName',
        'deductionType',
        'amount',
    ];

    protected $casts = [
        'deductions' => 'array',
    ];
}
