<?php

namespace App\Actions;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Issues and verifies the six-digit "Celestial OTP" used for phone sign-in.
 */
class IssueLoginCode
{
    private const TTL_MINUTES = 10;

    private const MAX_ATTEMPTS = 5;

    /**
     * Phone sign-in works when codes can reach the seeker: by SMS (MSG91), or shown on screen in debug mode.
     */
    public function canDeliver(): bool
    {
        return config('services.otp.debug') || $this->smsConfigured();
    }

    /**
     * Generate a fresh code for the phone number, send it by SMS when MSG91 is set up, and return it.
     * Returns null when the SMS could not be sent.
     */
    public function issue(string $phone): ?string
    {
        $code = (string) random_int(100000, 999999);

        if ($this->smsConfigured() && ! $this->sendSms($phone, $code)) {
            return null;
        }

        Cache::put($this->cacheKey($phone), ['hash' => Hash::make($code), 'attempts' => 0], now()->addMinutes(self::TTL_MINUTES));
        Log::info('Celestial OTP issued', ['phone' => $phone, 'code' => config('services.otp.debug') ? $code : '[hidden]']);

        return $code;
    }

    private function smsConfigured(): bool
    {
        return filled(config('services.msg91.auth_key')) && filled(config('services.msg91.template_id'));
    }

    /**
     * Deliver our own code through MSG91's OTP API (it fills the code into the approved DLT template).
     */
    private function sendSms(string $phone, string $code): bool
    {
        $digits = preg_replace('/\D/', '', $phone);
        $mobile = strlen($digits) === 10 ? "91{$digits}" : $digits;

        try {
            $response = Http::withHeaders(['authkey' => config('services.msg91.auth_key')])
                ->acceptJson()
                ->timeout(15)
                ->post('https://control.msg91.com/api/v5/otp?'.http_build_query([
                    'template_id' => config('services.msg91.template_id'),
                    'mobile' => $mobile,
                    'otp' => $code,
                    'otp_expiry' => self::TTL_MINUTES,
                ]));
        } catch (ConnectionException $exception) {
            Log::warning('MSG91 unreachable', ['error' => $exception->getMessage()]);

            return false;
        }

        if ($response->failed() || $response->json('type') === 'error') {
            Log::warning('MSG91 OTP send failed', ['status' => $response->status(), 'message' => $response->json('message')]);

            return false;
        }

        return true;
    }

    /**
     * Check a submitted code. A code can be used once and is discarded after too many wrong attempts.
     */
    public function verify(string $phone, string $code): bool
    {
        $key = $this->cacheKey($phone);
        $entry = Cache::get($key);

        if ($entry === null) {
            return false;
        }

        if (Hash::check($code, $entry['hash'])) {
            Cache::forget($key);

            return true;
        }

        $entry['attempts']++;
        $entry['attempts'] >= self::MAX_ATTEMPTS
            ? Cache::forget($key)
            : Cache::put($key, $entry, now()->addMinutes(self::TTL_MINUTES));

        return false;
    }

    private function cacheKey(string $phone): string
    {
        return 'login-code:'.preg_replace('/\D/', '', $phone);
    }
}
