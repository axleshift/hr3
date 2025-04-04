<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;

class Leave extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'leaves';
    protected $fillable = [
        'name',
        'type',
        'pay_rate',
        'description',
        'max_days_per_year', 
        'eligibility_rules'
    ];

    protected static function boot()
    {
        parent::boot();

        static::created(function ($leaveType) {
            Log::info('Leave Type Created: ', $leaveType->toArray());
        });

        static::updated(function ($leaveType) {
            Log::info('Leave Type Updated: ', $leaveType->toArray());
        });

        static::deleted(function ($leaveType) {
            Log::info('Leave Type Deleted: ', $leaveType->toArray());
        });
    }
}
