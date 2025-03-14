<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    /**
     * Display the user's profile.
     */
    public function show($userId)
    {
        $profile = Profile::where('user_id', $userId)->first();

        if (!$profile) {
            return response()->json([
                'message' => 'Profile not found',
                'data' => null,
            ], 404);
        }

        return response()->json([
            'message' => 'Profile retrieved successfully',
            'data' => [
                'user_id' => $profile->user_id,
                'profile_url' => asset('storage/' . $profile->profile_path),
            ],
        ]);
    }

    /**
     * Store or update the user's profile picture.
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'profile' => 'required|file|mimes:jpg,jpeg,png|max:50',
        ]);

        $userId = $request->input('user_id');
        $profile = Profile::where('user_id', $userId)->first();

        if ($profile && $profile->profile_path) {
            Storage::disk('public')->delete($profile->profile_path);
        }

        $filePath = null;
        if ($request->hasFile('profile')) {
            $file = $request->file('profile');
            $filePath = $file->store('profiles', 'public');
        }

        if ($profile) {
            $profile->update(['profile_path' => $filePath]);
        } else {
            $profile = Profile::create([
                'user_id' => $userId,
                'profile_path' => $filePath,
            ]);
        }

        return response()->json([
            'message' => 'Profile uploaded successfully',
            'data' => [
                'user_id' => $profile->user_id,
                'profile_url' => asset('storage/' . $profile->profile_path),
            ],
        ], 201);
    }

    
    
    public function update(Request $request, $id)
    {
        // Find the user by ID
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Validate the request data
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'username' => 'sometimes|string|max:255|unique:users,username,' . $user->id,
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        // Update the user's information
        $user->update($request->only(['name', 'username', 'email']));

        return response()->json(['success' => 'Profile updated successfully.', 'user' => $user]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($userId)
    {
        $profile = Profile::where('user_id', $userId)->first();

        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        if ($profile->profile_path) {
            Storage::disk('public')->delete($profile->profile_path);
        }

        $profile->delete();

        return response()->json([
            'message' => 'Profile deleted successfully',
        ]);
    }
}
