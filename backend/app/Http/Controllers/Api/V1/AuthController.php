<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function __construct(private AuthService $authService) {}

    public function register(Request $request): JsonResponse
    {
        $v = Validator::make($request->all(), [
            'name'     => 'required|string|max:100',
            'email'    => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
            'phone'    => 'nullable|string|max:20',
        ]);

        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $result = $this->authService->register($v->validated());
        return response()->json($result, 201);
    }

    public function login(Request $request): JsonResponse
    {
        $v = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $result = $this->authService->login($v->validated());
        if (!$result) return response()->json(['message' => 'Invalid credentials'], 401);

        return response()->json($result);
    }

    public function me(): JsonResponse
    {
        return response()->json(auth()->user()->load('addresses'));
    }

    public function refresh(): JsonResponse
    {
        return response()->json(['token' => $this->authService->refresh()]);
    }

    public function logout(): JsonResponse
    {
        auth()->logout();
        return response()->json(['message' => 'Logged out']);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $v = Validator::make($request->all(), [
            'name'   => 'sometimes|string|max:100',
            'phone'  => 'sometimes|string|max:20',
            'avatar' => 'sometimes|image|max:2048',
        ]);

        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $user = auth()->user();
        $data = $v->validated();

        if ($request->hasFile('avatar')) {
            $data['avatar'] = $request->file('avatar')->store('avatars', 's3');
        }

        $user->update($data);
        return response()->json($user->fresh());
    }
}
