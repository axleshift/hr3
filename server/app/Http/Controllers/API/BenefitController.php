<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Benefit;
use App\Models\Employee;
use App\Models\BenefitTypes;

class BenefitController extends Controller
{
    public function index(Request $request)
    {
        // $benefits = Benefit::all();
        // return response()->json($benefits);

        $query = Benefit::query();
    
    if ($request->has('employee_id')) {
        $query->where('employee_id', $request->employee_id);
    }
    
    if ($request->has('year') && $request->has('month')) {
        $query->whereYear('created_at', $request->year)
              ->whereMonth('created_at', $request->month);
    }
    
    return $query->get();
    }

    public function getBenefitTypes()
    {
        $benefitTypes = BenefitTypes::all();
        return response()->json($benefitTypes);
    }

    public function show($id)
    {
        $benefit = Benefit::find($id);
        if (!$benefit) {
            return response()->json(['error' => 'Benefit not found'], 404);
        }
        return response()->json($benefit);
    }

    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:Pag-ibig,SSS,PhilHealth,13th Month Pay,Service Incentive Leave',
            'amount' => 'required|numeric|min:0'
        ]);

        $employees = Employee::all();

        foreach ($employees as $employee) {
            Benefit::create([
                'employee_id' => $employee->employee_id,
                'name' => $employee->name,
                'type' => $request->type,
                'amount' => $request->amount
            ]);
        }
        return response()->json([
            'message' => 'Benefits applied successfully!'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $benefit = Benefit::findOrFail($id);

        $validated = $request->validate([
            'type' => 'sometimes|required|in:Pag-ibig,SSS,PhilHealth,13th Month Pay,Service Incentive Leave',
            'amount' => 'sometimes|required|numeric|min:0'
        ]);

        $benefit->update($validated);
        return response()->json($benefit);
    }

    public function destroy($id)
    {
        $benefit = Benefit::find($id);
        if (!$benefit) {
            return response()->json(['error' => 'Benefit not found'], 404);
        }

        $benefit->delete();

        return response()->json([
            'message' => 'Benefit deleted successfully!',
        ]);
    }
}