<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LeaveCredit;
use App\Models\Employee;

class LeaveCreditController extends Controller
{
    public function index()
    {
        return response()->json(LeaveCredit::with('employee')->get());
    }

    public function show($id)
    {
        $leaveCredit = LeaveCredit::where('employee_id', $id)->first();
        if (!$leaveCredit) {
            return response()->json(['message' => 'Leave credits not found'], 404);
        }
        return response()->json($leaveCredit);
    }

    public function store(Request $request)
    {
        $request->validate([
            'LWOP' => 'required|integer|min:0',
            'SL' => 'required|integer|min:0',
            'VL' => 'required|integer|min:0',
        ]);
    
        $employees = Employee::all();
    
        if ($employees->isEmpty()) {
            return response()->json(['message' => 'No employees found'], 404);
        }
    
        $createdCredits = [];
    
        foreach ($employees as $employee) {
            $leaveCredit = LeaveCredit::create([
                'employee_id' => $employee->employee_id, // Use employee_id
                'name' => $employee->name, // Get the employee name from the employees table
                'LWOP' => $request->LWOP,
                'SL' => $request->SL,
                'VL' => $request->VL,
            ]);
    
            $createdCredits[] = $leaveCredit;
        }
    
        return response()->json([
            'message' => 'Leave credits applied to all employees successfully',
            'data' => $createdCredits,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'LWOP' => 'required|integer|min:0',
            'SL' => 'required|integer|min:0',
            'VL' => 'required|integer|min:0',
        ]);

        // Fetch the employee details
        $employee = Employee::find($id);
        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }

        // Update or create leave credits with employee details
        $leaveCredit = LeaveCredit::updateOrCreate(
            ['employee_id' => $id],
            [
                'LWOP' => $request->LWOP,
                'SL' => $request->SL,
                'VL' => $request->VL,
                'name' => $employee->name, // Save the employee name
            ]
        );

        return response()->json(['message' => 'Leave credits updated successfully', 'data' => $leaveCredit]);
    }
}
