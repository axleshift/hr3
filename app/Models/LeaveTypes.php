<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeaveTypes extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'pay_rate',
        'eligibility_rules',
        // 'description',
        // 'max_days_per_year',
    ];
    
}
