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
        Schema::create('payslips', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id')->nullable();
            $table->string('user_id')->nullable();
            $table->string('name')->nullable();
            $table->decimal('net_salary', 10, 2)->nullable();
            $table->decimal('base_salary', 10, 2)->nullable();
            $table->decimal('benefits_total', 10, 2)->nullable();
            $table->decimal('total_overtime_amount', 8, 2)->nullable();
            $table->decimal('bonus', 8, 2)->default(0);
            $table->decimal('tax', 8, 2)->default(0);
            $table->decimal('deduction', 8, 2)->default(0);
            $table->integer('month')->nullable();
            $table->string('department')->nullable();
            $table->string('job_position')->nullable();
            $table->integer('year')->nullable();
            $table->string('status')->default('Paid');
            $table->timestamp('issued_at')->nullable();
            $table->string('password')->nullable();
            $table->string('pdf_path')->nullable();
            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payslips');
    }
};
