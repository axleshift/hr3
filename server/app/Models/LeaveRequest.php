<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeaveRequest extends Model
{
    use HasFactory;

    protected $table = 'leave_requests';
    protected $fillable = [
        'user_id',
        'department',
        'employeeId',
        'job_position',
        'name', 
        'leave_type',
        'start_date',
        'is_taken',
        'is_converted',
        'end_date',
        'reason',
        'total_days',
        'status',
        'is_paid',
        'document_path',
        'month',
        'leave_used',
        'department',
        'paid_amount',
        'remarks',
        'leave_status'
    ];
    
    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function leave()
    {
        return $this->belongsTo(Leave::class);
    }
}
