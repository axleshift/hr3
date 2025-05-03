<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use App\Mail\TwoFactorAuthMail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;

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
    
        $user = User::create([
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
    
    // public function login(Request $request)
    // {
    //     $credentials = $request->only('email', 'password');
 
    //     if (Auth::attempt($credentials)) {
    //         $request->session()->regenerate();
    //         $sessionId = $request->session()->getId();
            
    //         return response()->json([
    //             'message' => 'Login successful',
    //             'user' => Auth::user(),
    //             'session_id' => $sessionId
    //         ]);
    //     }
    //     return response()->json(['message' => 'Login failed'], 401);
    // }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
 
        if (Auth::validate($credentials)) {
            $user = User::where('email', $request->email)->first();
            
            $token = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            $user->two_factor_token = $token;
            $user->two_factor_expires_at = now()->addMinutes(10);
            $user->save();
            
            Mail::to($user->email)->send(new TwoFactorAuthMail($token));
            
            return response()->json([
                'message' => '2FA token sent to email',
                'requires_2fa' => true,
                'temp_session' => Session::getId() // Temporary session for 2FA
            ]);
        }
        
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    public function verifyTwoFactor(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|digits:6'
        ]);
        
        $user = User::where('email', $request->email)
                   ->where('two_factor_token', $request->token)
                   ->where('two_factor_expires_at', '>', now())
                   ->first();
        
        if ($user) {
            $user->two_factor_token = null;
            $user->two_factor_expires_at = null;
            $user->save();
            
            Auth::login($user);
            $sessionId = $request->session()->getId();
            
            return response()->json([
                'message' => 'Login successful',
                'user' => $user,
                'session_id' => $sessionId
            ]);
        }
        
        return response()->json(['message' => 'Invalid 2FA token'], 401);
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