<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payrolls', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id');
            $table->string('name')->nullable();
            $table->decimal('total_regular_hours', 8, 2)->nullable();
            $table->decimal('total_undertime_hours', 8, 2)->nullable();
            $table->decimal('total_overtime_hours', 8, 2)->nullable();
            $table->decimal('total_overtime_amount', 8, 2)->nullable();
            $table->decimal('net_salary', 10, 2)->nullable();
            $table->decimal('deduction', 8, 2)->default(0);
            $table->decimal('bonus', 8, 2)->default(0);
            $table->integer('year')->nullable();
            $table->integer('month')->nullable();
            $table->enum('status', ['Pending', 'Paid'])->default('Pending');
            $table->timestamps();

            $table->unique(['employee_id', 'year', 'month'], 'unique_employee_year_month');
        });
    }
    
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payrolls');
    }
};
