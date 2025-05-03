<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Benefit;
use App\Models\Employee;
use App\Models\BenefitTypes;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BenefitController extends Controller
{
    public function index(Request $request)
    {
        $query = Benefit::query();
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->has('employeeId')) {
            $query->where('employeeId', $request->employeeId);
        }
        
        if ($request->has('year') && $request->has('month')) {
            $query->whereYear('created_at', $request->year)
                  ->whereMonth('created_at', $request->month);
        }
        
        $benefits = $query->get();
        
        $benefits->transform(function ($item, $key) {
            $item->display_id = $key + 1;
            return $item;
        });
        
        return response()->json($benefits);
    }

    public function getBenefitTypes()
    {
        $benefitTypes = BenefitTypes::all();
        return response()->json($benefitTypes);
    }

    public function getEmployeesFromExternalApi()
    {
        try {
            $response = Http::get('https://backend-hr1.axleshift.com/api/employees');
            
            if ($response->successful()) {
                $data = $response->json();
                
                if (is_array($data)) {
                    return $data;
                }
                
                if (isset($data['employeeId'])) {
                    return [$data];
                }
                
                Log::error('Unexpected API response format', ['response' => $data]);
                return null;
            }
            
            Log::error('Failed to fetch employees from external API', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);
            return null;
            
        } catch (\Exception $e) {
            Log::error('Error fetching employees from external API: ' . $e->getMessage());
            return null;
        }
    }

    public function show($id)
    {
        $benefit = Benefit::find($id);
        if (!$benefit) {
            return response()->json(['error' => 'Benefit not found'], 404);
        }
        return response()->json($benefit);
    }

    // public function store(Request $request)
    // {
    //     $request->validate([
    //         'type' => 'required|in:Pag-ibig,SSS,PhilHealth,13th Month Pay,Service Incentive Leave',
    //         'amount' => 'required|numeric|min:0',
    //         'status' => 'sometimes|in:Active,Inactive',
    //     ]);

    //     $employees = Employee::all();

    //     foreach ($employees as $employee) {
    //         Benefit::create([
    //             'employee_id' => $employee->employee_id,
    //             'name' => $employee->name,
    //             'type' => $request->type,
    //             'amount' => $request->amount,
    //             'status' => $request->status ?? 'Active',
    //         ]);
    //     }
        
    //     return response()->json([
    //         'message' => 'Benefits applied successfully!'
    //     ], 201);
    // }

    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:Pag-ibig,SSS,PhilHealth,13th Month Pay,Bonus',
            'amount' => 'required|numeric|min:0',
            'status' => 'sometimes|in:Active,Inactive',
        ]);

        $employees = $this->getEmployeesFromExternalApi();
        
        if (!$employees) {
            return response()->json(['error' => 'Failed to fetch employees from external API'], 500);
        }

        foreach ($employees as $employee) {
            if (strtolower($employee['position'] ?? '') === 'hr intern') {
                continue;
            }

            $nameParts = [
                $employee['firstName'] ?? '',
                $employee['middleName'] ?? '',
                $employee['lastName'] ?? ''
            ];
            $fullName = trim(implode(' ', array_filter($nameParts)));

            Benefit::create([
                'employeeId' => $employee['employeeId'],
                'name' => $fullName,
                'type' => $request->type,
                'amount' => $request->amount,
                'status' => $request->status ?? 'Active',
            ]);
        }
        
        return response()->json([
            'message' => 'Benefits applied successfully!'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $benefit = Benefit::findOrFail($id);

        $validated = $request->validate([
            'type' => 'sometimes|required|in:Pag-ibig,SSS,PhilHealth,13th Month Pay,Bonus',
            'amount' => 'sometimes|required|numeric|min:0',
            'status' => 'sometimes|required|in:Active,Inactive',
        ]);

        $benefit->update($validated);
        return response()->json($benefit);
    }

    public function destroy($id)
    {
        $benefit = Benefit::find($id);
        if (!$benefit) {
            return response()->json(['error' => 'Benefit not found'], 404);
        }

        $benefit->delete();

        return response()->json([
            'message' => 'Benefit deleted successfully!',
        ]);
    }
}