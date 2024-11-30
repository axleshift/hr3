<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PayslipController extends Controller
{
    /**
     * Display a listing of the resource.
     */

     public function generatePayslip(Request $request)
    {
        $data = $request->validate([
            'employee_id' => 'required|integer',
            'gross_salary' => 'required|numeric',
            'deductions' => 'required|numeric',
            'bonuses' => 'nullable|numeric',
        ]);

        $net_salary = $data['gross_salary'] - $data['deductions'] + ($data['bonuses'] ?? 0);

        $payslip = Payslip::create([
            'employee_id' => $data['employee_id'],
            'gross_salary' => $data['gross_salary'],
            'deductions' => $data['deductions'],
            'bonuses' => $data['bonuses'] ?? 0,
            'net_salary' => $net_salary,
        ]);

        // Send payslip via email
        Mail::to($request->user()->email)->send(new \App\Mail\PayslipMail($payslip));

        return response()->json($payslip, 201);
    }

    public function getPayslips(Request $request)
    {
        $payslips = Payslip::where('employee_id', $request->user()->id)->get();
        return response()->json($payslips);
    }
    
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
