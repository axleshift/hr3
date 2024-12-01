<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\API\DirectDeposit;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DirectDepositController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'bank_name' => 'required|string|max:255',
            'account_number' => 'required|string',
            'routing_number' => 'required|string',
            'account_type' => 'required|string|in:checking,savings',
        ]);

        $deposit = DirectDeposit::create([
            'user_id' => auth()->id(),
            'bank_name' => $request->bank_name,
            'account_number' => $request->account_number,
            'routing_number' => $request->routing_number,
            'account_type' => $request->account_type,
        ]);

        return response()->json($deposit, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $deposit = DirectDeposit::where('user_id', auth()->id())->first();
        return response()->json($deposit);
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
