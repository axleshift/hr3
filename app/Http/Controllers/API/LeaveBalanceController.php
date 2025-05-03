<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LeaveBalance;
use Illuminate\Support\Facades\Log;
use App\Models\Payroll;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator; 


class LeaveBalanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
{
    $currentYear = date('Y');
    $leaveBalances = LeaveBalance::where('year', $currentYear)->get();
    return response()->json($leaveBalances);
}

    public function getEmployeeLeaveBalances($employeeId)
    {
        $balances = LeaveBalance::with('leaveType')
            ->where('employeeId', $employeeId)
            ->orderBy('year', 'desc')
            ->get();
        
        return response()->json($balances);
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

            /**
 * Store a newly created resource in storage.
 */
public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'days' => 'required|integer|min:1',
        'year' => 'required|integer|min:2000|max:2100',
        'convert_to_earnings' => 'sometimes|boolean',
        'conversion_rate' => 'sometimes|numeric|min:0|max:100',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'error' => $validator->errors()
        ], 400);
    }

    // First check if any records exist for this year
    $existingRecords = LeaveBalance::where('year', $request->year)->exists();
    if ($existingRecords) {
        return response()->json([
            'error' => 'Leave balances already exist for year ' . $request->year,
            'message' => 'Cannot add duplicate leave balances for the same year'
        ], 409); // 409 Conflict status code
    }

    $externalEmployees = $this->getEmployeesFromExternalApi();
    
    if (!$externalEmployees) {
        return response()->json([
            'error' => 'Failed to fetch employee data from external API',
            'suggestion' => 'Check if the API endpoint is accessible: https://backend-hr1.axleshift.com/api/employees'
        ], 500);
    }

    $createdCount = 0;
    $errors = [];

    foreach ($externalEmployees as $employee) {
        try {
            if (empty($employee['employeeId']) || empty($employee['firstName'])) {
                $errors[] = [
                    'employee' => $employee,
                    'error' => 'Missing required fields'
                ];
                continue;
            }

            LeaveBalance::create([
                'employeeId' => $employee['employeeId'],
                'firstName' => $employee['firstName'],
                'middleName' => $employee['middleName'] ?? null,
                'lastName' => $employee['lastName'] ?? null,
                'year' => $request->year,
                'allocated_days' => $request->days,
                'used_days' => 0,
                'remaining_days' => $request->days,
                'convert_to_earnings' => $request->convert_to_earnings ?? false,
                'conversion_rate' => $request->conversion_rate ?? 100,
            ]);
            $createdCount++;
        } catch (\Exception $e) {
            $errors[] = [
                'employeeId' => $employee['employeeId'] ?? 'unknown',
                'error' => $e->getMessage()
            ];
            Log::error('Failed to create leave balance', [
                'employee' => $employee,
                'error' => $e->getMessage()
            ]);
        }
    }
    
    return response()->json([
        'message' => 'Leave balances processed',
        'stats' => [
            'total_employees' => count($externalEmployees),
            'successful' => $createdCount,
            'failed' => count($errors)
        ],
        'errors' => $errors
    ], $createdCount > 0 ? 201 : 500);
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
            'used_days' => 'required|integer|min:0',
            'allocated_days' => 'required|integer|min:0',
        ]);

        try {
            $balance = LeaveBalance::findOrFail($id);
            $balance->update([
                'used_days' => $request->used_days,
                'allocated_days' => $request->allocated_days,
                'remaining_days' => $request->allocated_days - $request->used_days
            ]);
            
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

    /**
     * Convert unused leave to earnings (to be called during payroll processing)
     */
    public function convertUnusedLeaveToEarnings($employeeId, $year)
    {
        $balance = LeaveBalance::where('employeeId', $employeeId)
            ->where('year', $year)
            ->where('convert_to_earnings', true)
            ->whereColumn('allocated_days', '>', 'used_days')
            ->first();

        if (!$balance) {
            return [
                'total_earnings' => 0,
                'conversions' => [],
            ];
        }

        $unusedDays = $balance->allocated_days - $balance->used_days;
        $payroll = Payroll::where('employeeId', $employeeId)
            ->whereYear('pay_period', $year)
            ->first();
            
        if ($payroll && $unusedDays > 0) {
            $dailyRate = $payroll->daily_rate;
            $convertedAmount = $dailyRate * $unusedDays * ($balance->conversion_rate / 100);
            
            // Mark these days as used to prevent double conversion
            $balance->used_days = $balance->allocated_days;
            $balance->save();

            return [
                'total_earnings' => $convertedAmount,
                'conversions' => [[
                    'unused_days' => $unusedDays,
                    'conversion_rate' => $balance->conversion_rate,
                    'amount' => $convertedAmount,
                ]],
            ];
        }

        return [
            'total_earnings' => 0,
            'conversions' => [],
        ];
    }
}