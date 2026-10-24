<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Actions\CreditWallet;
use App\Http\Controllers\Controller;
use App\Http\Resources\SeekerResource;
use App\Models\Seeker;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class RegisteredSeekerController extends Controller
{
    public function store(Request $request, CreditWallet $wallet): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:255', Rule::unique('seekers', 'email')],
            'password' => ['required', Password::min(8)],
        ]);

        $seeker = Seeker::create($validated);
        $welcomeCredits = $wallet->grantSignupBonus($seeker);

        Auth::guard('seeker')->login($seeker, remember: true);
        $request->session()->regenerate();

        return (new SeekerResource($seeker))
            ->additional($welcomeCredits > 0 ? ['welcome_credits' => $welcomeCredits] : [])
            ->response()
            ->setStatusCode(201);
    }
}
