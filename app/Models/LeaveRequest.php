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
        'name', 
        'leave_type',
        'start_date',
        'end_date',
        'reason',
        'total_days',
        'status',
        'is_paid',
        'document_path',
        'month',
        'leave_used',
        'department',
        // 'rejected_date',
        // 'approved_date',
        'paid_amount'
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
