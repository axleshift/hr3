<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Leave extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'type',
        'pay_rate',
        'leave_balance',
        'leave_used',
        'is_active',
        'requires_approval',
        'description'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'requires_approval' => 'boolean',
        'pay_rate' => 'decimal:2',
        'leave_balance' => 'decimal:2',
        'leave_used' => 'decimal:2'
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopePaid($query)
    {
        return $query->where('type', 'Paid');
    }

    public function scopeUnpaid($query)
    {
        return $query->where('type', 'Unpaid');
    }
}
