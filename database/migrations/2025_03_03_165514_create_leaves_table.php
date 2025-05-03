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
            // $table->string('eligibility_rules')->nullable();
            $table->string('is_convertible')->default('No');
            $table->decimal('conversion_rate', 8, 2)->nullable();
            // $table->integer('max_conversion_days')->nullable();
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
