<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Rate;

class SalaryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $overtimeRate = Rate::where('type', 'overtime_rate')->first();

        return response()->json([
            'overtime_rate' => $overtimeRate ? $overtimeRate->rate : null,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'overtime_rate' => 'required|numeric|min:0',
        ]);
    
        Rate::updateOrCreate(
            ['type' => 'overtime_rate'],
            ['rate' => $validated['overtime_rate']]
        );
        return response()->json(['message' => 'Rates saved successfully'], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
