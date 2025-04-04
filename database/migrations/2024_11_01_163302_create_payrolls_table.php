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
            $table->string('employee_id')->nullable();
            $table->string('user_id')->nullable()->constrained('users');
            $table->string('name')->nullable();
            $table->string('department')->nullable();
            $table->string('job_position')->nullable();
            
            $table->decimal('base_salary', 12, 2)->nullable();
            $table->decimal('daily_rate', 10, 2)->nullable();
            $table->decimal('monthly_rate', 10, 2)->nullable();
            $table->decimal('gross_salary', 12, 2)->nullable();
            $table->decimal('tax', 12, 2)->nullable();
            $table->decimal('bonus', 12, 2)->default(0);
            $table->decimal('deduction', 12, 2)->default(0);
            $table->decimal('benefits_total', 12, 2)->default(0);
            $table->decimal('net_salary', 12, 2)->nullable();
            $table->decimal('total_regular_hours', 8, 2)->nullable();
            $table->decimal('total_overtime_hours', 8, 2)->nullable();
            $table->decimal('total_overtime_amount', 12, 2)->nullable();
            $table->decimal('paid_leave_amount', 12, 2)->nullable();
            $table->decimal('total_late_hours', 8, 2)->nullable();
            $table->decimal('total_undertime_hours', 8, 2)->nullable();
            $table->decimal('days_worked', 8, 2)->nullable();
            $table->json('benefits_details')->nullable();
            $table->decimal('working_days', 8, 2)->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('payroll_status')->default('pending');
            $table->integer('year')->nullable();
            $table->integer('month')->nullable();
            $table->string('status')->default('Pending');
            $table->integer('period')->default(1);
            $table->timestamps();
            
            $table->index(['start_date', 'end_date']);
            $table->index(['month', 'year']);
            $table->index(['department', 'name']);
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
