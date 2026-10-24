<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureMcpApiKey
{
    /**
     * Let MCP clients in only with the API key set in Integrations, sent as a
     * bearer token or an X-API-Key header.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $key = (string) config('services.mcp.key');

        if ($key === '') {
            return response()->json(['message' => 'MCP access is turned off. Set an MCP API key in Integrations.'], 503);
        }

        $given = (string) ($request->bearerToken() ?: $request->header('X-API-Key'));

        if ($given === '' || ! hash_equals($key, $given)) {
            return response()->json(['message' => 'Invalid MCP API key.'], 401);
        }

        return $next($request);
    }
}
