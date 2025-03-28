<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BenefitTypes;

class BenefitTypesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $benefitTypes = BenefitTypes::all();
        return response()->json($benefitTypes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric',
        ]);

        $benefitTypes = BenefitTypes::create($request->only(['name', 'amount']));
        return response()->json($benefitTypes, 201);
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
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric',
        ]);

        $benefitTypes = BenefitTypes::findOrFail($id);
        $benefitTypes->update($request->only(['name', 'amount']));
        return response()->json($benefitTypes);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $benefitTypes = BenefitTypes::findOrFail($id);
        $benefitTypes->delete();
        return response()->json(null, 204);
    }
}
