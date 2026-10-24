<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Applies the seeker's chosen app language (sent by the React app as X-Locale) to the request.
 */
class SetLocaleFromHeader
{
    /**
     * Languages the seeker app supports. "hinglish" is Hindi written in Latin script.
     */
    public const SUPPORTED = ['en', 'hi', 'hinglish', 'kn'];

    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->header('X-Locale');

        if (in_array($locale, self::SUPPORTED, true)) {
            app()->setLocale($locale);
        }

        return $next($request);
    }
}
