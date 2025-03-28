<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Compliance extends Model
{
    use HasFactory;
    protected $table = 'compliances';
    protected $fillable = [
        'user_id',
        'status',
        'remarks',
        'month',
        'year',
    ];

    public function user()
    {
        return $this->hasMany(User::class);
    }
}
