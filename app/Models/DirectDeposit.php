<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DirectDeposit extends Model
{
    use HasFactory;

    protected $table = 'deposits';

    protected $fillable = [
        'bankName',
        'accountNumber',
        'routingNumber',
        'accountType',
    ];
}
