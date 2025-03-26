<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Employee extends Model
{
    use HasFactory;
    use Notifiable;
    protected $table = 'employees';
    protected $fillable = [
        'employee_id',
        'name',
        'job_position',
        'department',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function benefits()
    {
        return $this->hasMany(Benefit::class, 'employee_id', 'employee_id');
    }
}
