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
        Schema::create('benefits', function (Blueprint $table) {
            $table->id();
            $table->string('employeeId');
            $table->string('name');
            $table->enum('type', ['Pag-ibig', 'SSS', 'PhilHealth', '13th Month Pay', 'Bonus']);
            $table->decimal('amount', 10, 2);
            $table->string('status')->default('Active');

            $table->unique(['employeeId', 'type']);
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
