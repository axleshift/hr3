<?php

namespace App\Http\Controllers\API;

use App\Models\Salary;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;

class SalaryController extends Controller
{
    public function index()
    {
        $salaries = Salary::all(); // Fetch all salaries from the database
        return response()->json($salaries); // Return the data as JSON
    }
    
    public function show(Request $request)
    {
        $department = $request->input('department');
        $jobPosition = $request->input('job_position');

        $salary = Salary::where('department', $department)
                        ->where('job_position', $jobPosition)
                        ->first();

        if ($salary) {
            return response()->json($salary);
        }

        return response()->json(['message' => 'Salary not found'], 404);
    }

    public function store(Request $request)
    {
        $request->validate([
            'job_position' => 'required|string',
            'department' => 'required|string',
            'salary' => 'required|numeric',
        ]);

        $salary = Salary::create([
            'employee_id' => $request->employee_id,
            'job_position' => $request->job_position,
            'department' => $request->department,
            'salary' => $request->salary,
        ]);

        Log::info('Salary Created:', $salary->toArray());

        return response()->json(['message' => 'Salary added successfully', 'salary' => $salary], 201);
    }
}
