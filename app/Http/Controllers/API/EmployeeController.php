<?php

namespace App\Http\Controllers\API;

use App\Models\Employee;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Models\Salary;

class EmployeeController extends Controller
{
    public function index()
    {
        $employees = Employee::all();
        return response()->json($employees);
    }

    public function storeSalary(Request $request)
    {
        $validated = $request->validate([
            'job_position' => 'required|string',
            'department' => 'required|string',
            'salary' => 'required|numeric',
        ]);

        $salary = Salary::create($validated);
        return response()->json($salary, 201);
    }
}
