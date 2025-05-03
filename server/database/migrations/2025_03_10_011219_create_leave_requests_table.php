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
        Schema::create('leave_requests', function (Blueprint $table) {
            $table->id();
            $table->string('user_id')->nullable();
            $table->string('employeeId');
            $table->string('name')->index();
            $table->string('department');
            $table->string('job_position');
            $table->string('leave_type');
            $table->date('start_date');
            $table->date('end_date');
            $table->text('reason');
            $table->text('remarks')->nullable();
            $table->integer('total_days');
            $table->integer('month')->nullable();
            $table->decimal('paid_amount')->nullable();
            $table->enum('is_paid', ['Paid', 'Unpaid'])->default('Unpaid');
            $table->enum('status', ['Pending', 'Approved', 'Rejected'])->default('Pending');
            $table->enum('leave_status', ['Pending', 'Approved', 'Rejected'])->default('Pending');
            $table->json('document_path')->nullable();
    $table->boolean('is_converted')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leave_requests');
    }
};


