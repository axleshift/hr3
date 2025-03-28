<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Compliance;

class ComplianceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $compliances = Compliance::all();
        return response()->json($compliances);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        $compliance = Compliance::create($request->only(['name', 'description', 'status']));
        return response()->json($compliance, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $compliance = Compliance::find($id);
        if (!$compliance) {
            return response()->json(['message' => 'Compliance not found'], 404);
        }
        return response()->json($compliance);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:active,inactive',
        ]);

        $compliance = Compliance::find($id);
        if (!$compliance) {
            return response()->json(['message' => 'Compliance not found'], 404);
        }

        $compliance->update($request->only(['name', 'description', 'status']));
        return response()->json($compliance);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $compliance = Compliance::find($id);
        if (!$compliance) {
            return response()->json(['message' => 'Compliance not found'], 404);
        }

        $compliance->delete();
        return response()->json(['message' => 'Compliance deleted successfully']);
    }
}
