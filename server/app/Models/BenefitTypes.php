<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BenefitTypes extends Model
{
    use HasFactory;
    protected $table = 'benefit_types';
    protected $fillable = [
        'name',
        'amount',
    ];
    
    public function benefits()
    {
        return $this->hasMany(Benefit::class, 'benefit_type_id');
    }
}
