<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BudgetRequest extends Model
{
    use HasFactory;

    protected $table = 'budget_requests';
    protected $fillable = [
        'department',
        'typeOfRequest',
        'category',
        'reason',
        'totalRequest',
        'documents',
        'status',
        'comment'
    ];
}
