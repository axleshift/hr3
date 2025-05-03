<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Leave;
use App\Models\Employee;
use App\Models\Payroll;
use App\Models\LeaveBalance;
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
            'is_convertible' => 'required|in:Yes,No',
            'conversion_rate' => 'required|numeric|min:0',
            // 'eligibility_rules' => 'required|string',
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
            $validatedData['conversion_rate'] = 0;
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
            'is_convertible' => 'required|in:Yes,No',
            'conversion_rate' => 'required|numeric|min:0'
            // 'eligibility_rules' => 'required|string',
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
            $validatedData['conversion_rate'] = 0;
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
        $leave->delete();

        return response()->json([
            'message' => 'Leave type deleted successfully'
        ]);
    }
}
