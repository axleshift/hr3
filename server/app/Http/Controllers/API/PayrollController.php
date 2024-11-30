<?php

namespace App\Http\Controllers\API;

use App\Models\Payroll;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class PayrollController extends Controller
{
    public function index()
    {
        $payrolls = Payroll::all();
        return response()->json([
            'status' => 200,
            'payrolls' => $payrolls,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employeeId' => 'required|integer',
            'employeeName' => 'required|string|max:255',
            'basicSalary' => 'required|integer',
            'overtime' => 'nullable|integer',
            'bonus' => 'nullable|integer',
            'deductions' => 'nullable|integer',
            'hoursWorked' => 'nullable|integer',
            'benefits' => 'nullable|integer',
            'netSalary' => 'nullable|integer',
            'paymentMethod' => 'nullable|string|max:50',
            'status' => 'nullable|string',
            'accountNumber' => ($request->paymentMethod == 'Bank Transfer' || $request->paymentMethod == 'E-Wallet') ? 'required|string|max:50' : 'nullable|string|max:50',
            // 'note' => 'nullable|string|max:255',
        ]);

        if ($validator->fails())
        {
            return response()->json([
                'status' => 422,
                'validate_err' => $validator->messages(),
            ]);
        }
        else
        {
            $payroll = new Payroll;
            $payroll->employeeId = $request->input('employeeId');
            $payroll->employeeName = $request->input('employeeName');
            $payroll->basicSalary = $request->input('basicSalary');
            $payroll->overtime = $request->input('overtime', 0);
            $payroll->bonus = $request->input('bonus', 0);
            $payroll->deductions = $request->input('deductions', 0);
            $payroll->benefits = $request->input('benefits', 0);
            $payroll->netSalary = $request->input('netSalary');
            $payroll->hoursWorked = $request->input('hoursWorked');
            $payroll->paymentMethod = $request->input('paymentMethod');
            $payroll->accountNumber = $request->input('accountNumber');
            $payroll->status = $request->input('status', 'Pending');
            // $payroll->note  = $request->input('note ');
           
            $payroll->save();

            return response()->json([
                'status' => 200,
                'message' => 'Payroll Added Successfully',
            ]);
        }
    }

    public function edit($id)
    {
        $payroll = Payroll::find($id);
        if ($payroll) {
            return response()->json([
                'status' => 200,
                'payroll' => $payroll,
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'No Payroll Found',
            ]);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'employeeId' => 'required|integer',
            'employeeName' => 'required|string|max:255',
            'basicSalary' => 'required|integer',
            'overtime' => 'nullable|integer',
            'bonus' => 'nullable|integer',
            'deductions' => 'nullable|integer',
            'benefits' => 'nullable|integer',
            'netSalary' => 'nullable|integer',
            'paymentMethod' => 'nullable|string|max:50',
            'accountNumber' => 'nullable|string|max:50',
            'status' => 'required|string|max:50',
            // 'note' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'validationErrors' => $validator->messages(),
            ]);
        }

        $payroll = Payroll::find($id);
        if ($payroll) {
            $payroll->employeeId = $request->input('employeeId');
            $payroll->employeeName = $request->input('employeeName', 0);
            $payroll->basicSalary = $request->input('basicSalary', 0);
            $payroll->overtime = $request->input('overtime', 0);
            $payroll->bonus = $request->input('bonus', 0);
            $payroll->deductions = $request->input('deductions', 0);
            $payroll->benefits = $request->input('benefits', 0);
            $payroll->netSalary = $request->input('netSalary');
            $payroll->paymentMethod = $request->input('paymentMethod');
            $payroll->accountNumber = $request->input('accountNumber');
            $payroll->status = $request->input('status');
            // $payroll->note = $request->input('note');
            $payroll->save();

            return response()->json([
                'status' => 200,
                'message' => 'Payroll Updated Successfully',
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'No Payroll Found',
            ]);
        }
    }

    public function destroy($id)
    {
        $payroll = Payroll::find($id);
        if ($payroll) {
            $payroll->delete();
            return response()->json([
                'status' => 200,
                'message' => 'Payroll Deleted Successfully',
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'No Payroll Found',
            ]);
        }
    }

    public function generatePayslip($id)
    {
        $payroll = Payroll::find($id);

        if (!$payroll) {
            return response()->json(['message' => 'Payroll record not found'], 404);
        }
        $pdf = PDF::loadView('payroll.payslip', compact('payroll'));
        return $pdf->download('payslip_' . $payroll->id . '.pdf');
    }
}
