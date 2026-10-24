<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Actions\CreditWallet;
use App\Actions\IssueLoginCode;
use App\Http\Controllers\Controller;
use App\Http\Resources\SeekerResource;
use App\Models\Seeker;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class OtpController extends Controller
{
    private const PHONE_RULES = ['required', 'string', 'regex:/^\+?[0-9 ]{10,16}$/'];

    /**
     * Send a one-time sign-in code to the phone number.
     */
    public function store(Request $request, IssueLoginCode $issueLoginCode): JsonResponse
    {
        if (! $issueLoginCode->canDeliver()) {
            return response()->json(['message' => __('Phone sign-in is not available yet. Please sign up with your email.')], 503);
        }

        $validated = $request->validate(['phone' => self::PHONE_RULES]);
        $code = $issueLoginCode->issue($validated['phone']);

        if ($code === null) {
            return response()->json(['message' => __('We could not send the SMS. Please try again or use email.')], 502);
        }

        return response()->json([
            'message' => __('Celestial OTP sent.'),
            ...(config('services.otp.debug') ? ['debug_code' => $code] : []),
        ]);
    }

    /**
     * Verify the code. "signup" creates the account (a name is needed) or simply signs in a number that already
     * has one; "login" only signs in existing accounts. Without an intent a new number gets an account, as before.
     */
    public function verify(Request $request, IssueLoginCode $issueLoginCode, CreditWallet $wallet): SeekerResource
    {
        $validated = $request->validate([
            'phone' => self::PHONE_RULES,
            'code' => ['required', 'digits:6'],
            'name' => ['nullable', 'required_if:intent,signup', 'string', 'max:120'],
            'intent' => ['nullable', 'in:signup,login'],
        ], ['name.required_if' => __('Please write your name.')]);

        if (! $issueLoginCode->verify($validated['phone'], $validated['code'])) {
            throw ValidationException::withMessages(['code' => __('That code is incorrect or has expired.')]);
        }

        $phone = '+'.ltrim(preg_replace('/[^0-9+]/', '', $validated['phone']), '+');

        if (($validated['intent'] ?? null) === 'login' && ! Seeker::where('phone', $phone)->exists()) {
            throw ValidationException::withMessages(['phone' => __('There is no account with this number yet. Please sign up — it is free.')]);
        }

        $seeker = Seeker::firstOrCreate(['phone' => $phone], ['name' => $validated['name'] ?? 'Seeker']);
        $welcomeCredits = $seeker->wasRecentlyCreated ? $wallet->grantSignupBonus($seeker) : 0;

        Auth::guard('seeker')->login($seeker, remember: true);
        $request->session()->regenerate();

        return (new SeekerResource($seeker))->additional($welcomeCredits > 0 ? ['welcome_credits' => $welcomeCredits] : []);
    }
}
