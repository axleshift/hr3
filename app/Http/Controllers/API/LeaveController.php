<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Leave;
use App\Models\Employee;
use Illuminate\Support\Facades\Validator;

class LeaveController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $leaves = Leave::all();
        return response()->json($leaves);
    }

      /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'type' => 'required|in:Paid,Unpaid',
            'pay_rate' => 'required|numeric',
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $validatedData = $validator->validated();
        
        if ($validatedData['type'] === 'Unpaid') {
            $validatedData['pay_rate'] = 0;
        }

        $leave = Leave::create($validatedData);
    
        return response()->json($leave, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $leave = Leave::find($id);
        
        if (!$leave) {
            return response()->json([
                'message' => 'Leave not found',
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'leaves' => [$leave],
        ]);
    }

     /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $leave = Leave::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'type' => 'required|in:Paid,Unpaid',
            'pay_rate' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $validatedData = $validator->validated();
        
        if ($validatedData['type'] === 'Unpaid') {
            $validatedData['pay_rate'] = 0;
        }

        $leave->update($validatedData);

        return response()->json($leave);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $leave = Leave::findOrFail($id);
        $hasBalances = Leave::where('leave_type_id', $id)->exists();
        
        if ($hasBalances) {
            return response()->json([
                'message' => 'Cannot delete leave type as it has associated leave balances',
            ], 400);
        }
        $leave->delete();

        return response()->json([
            'message' => 'Leave type deleted successfully']);
    }
}
