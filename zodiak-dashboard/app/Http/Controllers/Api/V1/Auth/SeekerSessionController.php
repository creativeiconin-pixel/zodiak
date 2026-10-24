<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\SeekerResource;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class SeekerSessionController extends Controller
{
    public function store(Request $request): SeekerResource
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::guard('seeker')->attempt($credentials, remember: true)) {
            throw ValidationException::withMessages(['email' => __('These credentials do not match our records.')]);
        }

        $request->session()->regenerate();

        return new SeekerResource(Auth::guard('seeker')->user());
    }

    public function destroy(Request $request): Response
    {
        Auth::guard('seeker')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->noContent();
    }
}
