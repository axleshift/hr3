<?php

namespace App\Http\Controllers\API;

use App\Models\Deduction;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class DeductionController extends Controller
{
    public function index()
    {
        $deductions = Deduction::all();
        return response()->json([
            'status' => 200,
            'deductions' => $deductions,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employeeId' => 'required|exists:employees,id',
            'employeeName' => 'required|string|max:255',
            'deductionType' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
        ]);

        $deduction = new Deduction();
        $deduction->employeeId = $validated['employeeId'];
        $deduction->employeeName = $validated['employeeName'];
        $deduction->deductionType = $validated['deductionType'];
        $deduction->amount = $validated['amount'];
        $deduction->save();

        return response()->json([
            'message' => 'Deduction saved successfully!',
            'data' => $deduction,
        ], 201);
    }


    // Edit a specific deduction record
    public function edit($id)
    {
        $deduction = Deduction::find($id);
        if ($deduction) {
            return response()->json([
                'status' => 200,
                'deduction' => $deduction,
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'No Deduction Found',
            ]);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'employeeId' => 'required|exists:employees,id',
            'employeeName' => 'required|string|max:255',
            'deductiontype' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'validationErrors' => $validator->messages(),
            ]);
        }

        $deduction = Deduction::find($id);
        if ($deduction) {
            $deduction->employeeId = $request->input('employeeId');
            $deduction->employeeName = $request->input('employeeName');
            $deduction->deductionType = $request->input('deductionType');
            $deduction->amount = $request->input('amount');
            $deduction->save();

            return response()->json([
                'status' => 200,
                'message' => 'Deduction Updated Successfully',
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'No Deduction Found',
            ]);
        }
    }

    public function destroy($id)
    {
        $deduction = Deduction::find($id);
        if ($deduction) {
            $deduction->delete();
            return response()->json([
                'status' => 200,
                'message' => 'Deduction Deleted Successfully',
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'No Deduction Found',
            ]);
        }
    }
}
