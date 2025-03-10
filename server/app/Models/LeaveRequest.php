<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeaveRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id', 
        'name', 
        'leave_type',
        'start_date',
        'end_date',
        'reason',
        'total_days',
        'status',
        'is_paid',
        'document_path',
    ];
}
