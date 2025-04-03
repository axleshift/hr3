<?php

namespace App\Http\Controllers\API;

use App\Models\Employee;
use App\Models\Benefit;
use App\Models\BenefitTypes;
use App\Models\LeaveRequest;
use App\Models\Payroll;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

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

    public function downloadPayslips($userId)
    {

    }

    public function getJobPositions()
    {
        $jobPositions = Employee::select('job_position')
            ->distinct()
            ->pluck('job_position');

        return response()->json($jobPositions);
    }

    public function getDepartments()
    {
        
        $department = Payroll::select('department')
            ->distinct()
            ->pluck('department');

        return response()->json($department);
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

    

    // URL 
    // public function getJobPositions()
    // {
    //     try {
    //         $response = Http::get("https://hr3.axleshift.com/api/employees");
            
    //         if ($response->successful()) {
    //             $employees = $response->json();
                
    //             // Extract unique job positions
    //             $jobPositions = collect($employees)
    //                 ->pluck('job_position')  // Fixed spelling
    //                 ->unique()
    //                 ->filter()
    //                 ->values()
    //                 ->toArray();
                
    //             return response()->json($jobPositions);
    //         }
            
    //         return response()->json([], 500);
            
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'message' => 'Failed to fetch job positions',  // Fixed spelling
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }

    // public function getDepartments()
    // {
    //     try {
    //         $response = Http::get("https://hr3.axleshift.com/api/employees");
            
    //         if ($response->successful()) {
    //             $employees = $response->json();
                
    //             // Extract unique departments
    //             $departments = collect($employees)
    //                 ->pluck('department')
    //                 ->unique()
    //                 ->filter()
    //                 ->values()
    //                 ->toArray();
                
    //             return response()->json($departments);
    //         }
            
    //         return response()->json([], 500);
            
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'message' => 'Failed to fetch departments',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }

}
