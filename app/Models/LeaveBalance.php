<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeaveBalance extends Model
{
    use HasFactory;

    protected $fillable = [
        'employeeId', 
        'firstName',
        'middleName',
        'lastName', 
        'used_days',
        'remaining_days',
        'allocated_days',
        'year',
        'convert_to_earnings',
        'conversion_rate',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function leaveType()
    {
        return $this->belongsTo(Leave::class, 'leave_type_id');
    }
}
