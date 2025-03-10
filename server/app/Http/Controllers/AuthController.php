<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class AuthController extends Controller
{
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