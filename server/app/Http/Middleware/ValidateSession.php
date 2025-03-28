<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ValidateSession
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $sessionId = $request->query('session_id');

        // Option 2: Get session ID from custom header
        // $sessionId = $request->header('X-Session-ID');

        // Validate the session ID (e.g., check if it exists in the database)
        $user = Auth::user();
        if (!$user || $user->session_id !== $sessionId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        return $next($request);
    }
}
