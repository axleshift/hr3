<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rate extends Model
{
    use HasFactory;
    
    protected $table = 'rates';
    protected $fillable = [
        'name',
        'rate',
    ];

    protected $casts = [
        'rate' => 'decimal:2'
    ];

    public static function getOvertimeRate()
    {
        return self::where('name', 'overtime')->first()->rate ?? 0;
    }
}
