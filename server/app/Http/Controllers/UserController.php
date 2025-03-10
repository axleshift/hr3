<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\User;

class UserController extends Controller
{
    public function getUser(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return response()->json([
            'name' => $user->name,
            'username' => $user->username,
            'email' => $user->email,
            'profile_picture' => $user->profile_picture ? url('storage/' . $user->profile_picture) : null,
        ]);
    }

    public function updateProfilePicture(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $request->validate([
            'profile_picture' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('profile_picture')) {
            $file = $request->file('profile_picture');

            // Store new file
            $path = $file->store('profile_pictures', 'public');

            // Delete old picture if exists
            if ($user->profile_picture) {
                Storage::disk('public')->delete($user->profile_picture);
            }

            // Update profile picture
            $user->profile_picture = $path;
            $user->save();

            return response()->json([
                'message' => 'Profile picture updated successfully',
                'profile_picture' => url("storage/$path"),
            ], 200);
        }

        return response()->json(['error' => 'Failed to upload profile picture'], 400);
    }
}
