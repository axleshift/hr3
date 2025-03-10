<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('benefits', function (Blueprint $table) {
        $table->id();
        $table->string('employee_name');
        $table->enum('benefit_type', ['health_insurance', 'dental_insurance', 'life_insurance', 'retirement_plan', 'paid_time_off']);
        $table->enum('status', ['active', 'inactive']);
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('benefits');
    }
};
