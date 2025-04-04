<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LeaveBalance;
use Illuminate\Support\Facades\Log;

class LeaveBalanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return LeaveBalance::with('employee')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'used_days' => 'required|integer',
            'remaining_days' => 'required|integer',
        ]);

        try {
            $balance = LeaveBalance::findOrFail($id);
            $balance->update($request->all());
            return response()->json($balance, 200);
        } catch (\Exception $e) {
            Log::error('Error updating leave balance: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update leave balance'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
    }
}
