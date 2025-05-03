<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;

class Leave extends Model
{
    use HasFactory;

    protected $table = 'leaves';
    protected $fillable = [
        'name',
        'type',
        'pay_rate',
        'is_convertible',
        'conversion_rate', 
        // 'max_conversion_days',
        // 'eligibility_rules'
    ];
}
