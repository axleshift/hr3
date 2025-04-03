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
        Schema::create('leaves', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type')->default('Unpaid');
            $table->decimal('pay_rate', 8, 2)->default(0);
            // $table->decimal('leave_balance', 8, 2)->nullable();
            // $table->decimal('leave_used', 8, 2)->default(0);
            // $table->integer('max_days_per_year')->nullable(); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leaves');
    }
};
