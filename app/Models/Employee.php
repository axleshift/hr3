<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;
    protected $table = 'employees';
    protected $fillable = [
        'employee_id',
        'name',
        'job_position',
        'department',
    ];

    // public function salaries()
    // {
    //     return $this->hasMany(Salary::class);
    // }
}
