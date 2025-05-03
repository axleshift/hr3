<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Rate;
use App\Models\Payroll;
use App\Models\Salary;

class SalaryController extends Controller
{
    /**
     * Display a listing of the resource.
     */

     public function all()
     {
          $salaries = Salary::all();
          return response()->json($salaries);
     } 
        
    public function index()
    {
        $overtimeRate = Rate::where('name', 'overtime')->first();

        return response()->json([
            'overtime_rate' => $overtimeRate ? $overtimeRate->rate : null,
        ]);
    }

    public function gtesalary()
    {
        $overtimeRate = Rate::where('name', 'overtime')->first();

        return response()->json([
            'overtime_rate' => $overtimeRate ? $overtimeRate->rate : null,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'rate' => 'required|numeric|min:0',
        ]);
    
        $rate = Rate::create([
            'name' => $request->name ?? 'overtime',
            'rate' => $request->rate ?? '75',
            
        ]);
    
        return response()->json([
            'message' => 'Rate added successfully',
            'data' => $rate
        ], 201);
    }
        // $validated = $request->validate([
        //     'overtime_rate' => 'required|numeric|min:0',
        // ]);
    
        // Rate::updateOrCreate(
        //     ['type' => 'overtime_rate'],
        //     ['rate' => $validated['overtime_rate']]
        // );
        // return response()->json(['message' => 'Rates saved successfully'], 201);
    
        
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
    public function update(Request $request, $name)
    {
        $request->validate([
            'rate' => 'required|numeric|min:0',
        ]);
    
        $rate = Rate::where('name', $name)->first();
    
        if (!$rate) {
            return response()->json([
                'message' => 'Rate not found',
            ], 404);
        }
    
        $rate->update([
            'rate' => $request->rate,
        ]);
    
        return response()->json([
            'message' => 'Rate updated successfully',
            'data' => $rate
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
    }
}
