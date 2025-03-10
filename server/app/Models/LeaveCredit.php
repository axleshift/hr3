<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeaveCredit extends Model
{
    use HasFactory;
    protected $fillable = [
        'employee_id',
        'name',
        'LWOP',
        'SL',
        'VL'
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }
}
