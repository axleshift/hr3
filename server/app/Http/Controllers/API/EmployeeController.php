<?php

namespace App\Http\Controllers\API;

use App\Models\Employee;
use App\Models\Benefit;
use App\Models\BenefitTypes;
use App\Models\LeaveRequest;
use App\Models\Payroll;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class EmployeeController extends Controller
{
    public function index()
    {
        $employees = Employee::all();
        return response()->json($employees);
    }

    public function show()
    {
        $employees = Employee::all();
        return response()->json($employees);
    }

    public function getLeaveHistory($id)
    {
        $employee = Employee::findOrFail($id);
        $leaveHistory = LeaveRequest::where('user_id', $id)->get();

        return response()->json($leaveHistory);
    }

    public function getID($userId)
    {
        $leaveRequests = LeaveRequest::where('user_id', $userId)->get();
        return response()->json([
            'status' => 200,
            'leaveRequests' => $leaveRequests,
        ]);
    }
    
    public function employee($id)
    {
        $employee = Employee::findOrFail($id);
        $leaveHistory = LeaveRequest::where('employee_id', $id)->get();

        return response()->json($leaveHistory);
    }

    public function getJobPositions()
    {
        
        $jobPositions = Employee::select('job_position')
            ->distinct()
            ->pluck('job_position');

        return response()->json($jobPositions);
    }

    public function update(Request $request, $id)
    {
        $employee = Employee::find($id);
        
        if (!$employee) {
            return response()->json(['error' => 'Employee not found'], 404);
        }
    
        $request->validate([
            'benefits' => 'sometimes|array',
            'benefits.*.benefit_type' => 'required_with:benefits|string',
            'benefits.*.amount' => 'required_with:benefits|numeric',
        ]);
    
        if ($request->has('benefits')) {
            // Delete existing benefits
            Benefit::where('employee_id', $employee->id)->delete();
            
            foreach ($request->benefits as $benefitData) {
                $benefitType = BenefitTypes::where('name', $benefitData['benefit_type'])->first();
                
                if ($benefitType) {
                    Benefit::create([
                        'employee_id' => $employee->employee_id,
                        'name' => $employee->name,
                        'benefit_type_id' => $benefitType->id,
                        'total' => $benefitData['amount']
                    ]);
                }
            }
        }
    
        return response()->json([
            'message' => 'Employee benefits updated successfully',
            'employee' => $employee->load('benefits')
        ]);
    }

    public function getDepartments()
    {
        
        $department = Payroll::select('department')
            ->distinct()
            ->pluck('department');

        return response()->json($department);
    }
}
