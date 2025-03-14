<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'username' => 'required|unique:users',
            'password' => 'required|min:6|confirmed',
            'password_confirmation' => 'required',
            'name' => 'required',
            'email' => 'required|email|unique:users',
        ]);
    
        // Get the last assigned employee ID
        $lastUser = User::whereNotNull('employee_id')->latest('id')->first();
    
        if ($lastUser && preg_match('/EMP-(\d+)/', $lastUser->employee_id, $matches)) {
            $nextNumber = str_pad((int)$matches[1] + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $nextNumber = '0001';
        }
    
        $employeeId = "EMP-{$nextNumber}";
    
        $user = User::create([
            'employee_id' => $employeeId,
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'name' => $request->name,
            'email' => $request->email,
        ]);
    
        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user
        ], 201);
    }
    
    public function login(Request $request)
    {
        $credentials = $request->only('username', 'password');
 
        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            $sessionId = $request->session()->getId();
            
            return response()->json([
                'message' => 'Login successful',
                'user' => Auth::user(),
                'session_id' => $sessionId
            ]);
        }
        return response()->json(['message' => 'Login failed'], 401);
    }

    public function verifySession(Request $request)
    {
        $sessionId = $request->input('session_id');

        if (Session::getId() === $sessionId && Auth::check()) {
            return response()->json([
                'message' => 'Session is active',
                'user' => Auth::user()
            ]);
        }
        return response()->json(['message' => 'Session is inactive or invalid'], 401);
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logout successful']);
    }
}