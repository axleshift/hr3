<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Leave;

class LeaveController extends Controller
{
    public function index()
    {
        $leaves = Leave::all();
        return response()->json($leaves);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:paid,unpaid',
        ]);
        $leave = Leave::create($request->only('name', 'type'));
    
        return response()->json($leave, 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:paid,unpaid',
        ]);
        $leave = Leave::findOrFail($id);
        $leave->update($request->only('name', 'type'));

        return response()->json($leave);
    }

    public function destroy($id)
    {
        $leave = Leave::findOrFail($id);
        $leave->delete();

        return response()->json(['message' => 'Leave type deleted successfully']);
    }
}
