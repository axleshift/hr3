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
            $table->integer('employeeId');
            $table->string('employeeName');
            $table->integer('basicSalary');
            $table->integer('overtime')->nullable();
            $table->integer('bonus')->nullable();
            $table->integer('deductions')->nullable();
            $table->integer('benefits')->nullable();
            $table->integer('hoursWorked')->nullable();
            $table->integer('netSalary')->nullable();
            $table->string('paymentMethod', 50)->nullable();
            $table->string('accountNumber', 50)->nullable();
            $table->string('status', 50)->default('Pending');
            // $table->string('note')->nullable();
            $table->timestamps();
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
