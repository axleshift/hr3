<?php

namespace App\Http\Controllers\API;

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Expense;

class ExpenseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $expenses = Expense::where('user_id', auth()->id())->get();
        return response()->json($expenses);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'expense_type' => 'required|string|max:255',
            'amount' => 'required|numeric',
            'date' => 'required|date',
            'description' => 'required|string|max:255',
            'receipt' => 'required|file|mimes:jpg,png,pdf|max:2048',
        ]);

        $receiptPath = $request->file('receipt')->store('receipts');

        // Save expense data
        $expense = Expense::create([
            'user_id' => auth()->id(),
            'expense_type' => $request->expense_type,
            'amount' => $request->amount,
            'date' => $request->date,
            'description' => $request->description,
            'receipt_file' => $receiptPath,
            'status' => 'pending',
        ]);

        return response()->json($expense, 201);
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
        $expense = Expense::find($id);

        if ($expense && $expense->status === 'pending') {
            $expense->status = $request->status;  // "approved" or "denied"
            $expense->save();
        }

        return response()->json($expense);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
