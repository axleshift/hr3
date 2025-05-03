<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Dispute;
use App\Models\Payroll;
use App\Models\User;

use Illuminate\Support\Facades\Validator;

class DisputeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $disputes = Dispute::with(['user', 'resolver'])->get();
        return response()->json($disputes);
    }

    public function statistics()
    {
        return response()->json([
            'total' => Dispute::count(),
            'submitted' => Dispute::where('status', 'submitted')->count(),
            'under_review' => Dispute::where('status', 'under_review')->count(),
            'resolved' => Dispute::where('status', 'resolved')->count(),
            'rejected' => Dispute::where('status', 'rejected')->count(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer',
            'name' => 'required|string',
            'type' => 'required|in:wages,hours,deductions,bonuses,taxes,benefits,other',
            'description' => 'required|string',
            'pay_period' => 'required|date',
        ]);

        $user = User::find($request->user_id);

        $dispute = Dispute::create([
            'user_id' => $user->id ?? null,
            'name' => $user->name,
            'type' => $request->type,
            'description' => $request->description,
            'pay_period' => $request->pay_period,
            'status' => 'submitted'
        ]);

        return response()->json($dispute, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $dispute = Dispute::with(['user', 'resolver'])->findOrFail($id);
        return response()->json($dispute);
    }

    public function userDisputes($userId)
    {
        $disputes = Dispute::where('user_id', $userId)->get();

        if ($disputes->isEmpty()) {
            return response()->json([
                'message' => 'No disputes found',
            ], 404);
        }

        return response()->json($disputes);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:submitted,under_review,resolved,rejected',
            'resolution_notes' => 'nullable|string',
        ]);

        $dispute = Dispute::findOrFail($id);
        
        $updates = [
            'status' => $request->status,
            'resolution_notes' => $request->resolution_notes
        ];


        $dispute->update($updates);

        return response()->json($dispute->load(['user', 'resolver']));
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
    }
}
