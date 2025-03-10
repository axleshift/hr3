<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Benefit;

class BenefitController extends Controller
{
    // Fetch a single benefit
    public function show($id)
    {
        $benefit = Benefit::find($id);
        if (!$benefit) {
            return response()->json(['error' => 'Benefit not found'], 404);
        }
        return response()->json($benefit);
    }

    // Store a new benefit
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'employee_name' => 'required|string|max:255',
            'benefit_type' => 'required|in:health_insurance,dental_insurance,life_insurance,retirement_plan,paid_time_off',
            'status' => 'required|in:active,inactive'
        ]);

        $benefit = Benefit::create($validatedData);
        return response()->json($benefit, 201);
    }
}
