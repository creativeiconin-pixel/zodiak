<?php

use App\Http\Middleware\EnsureMcpApiKey;
use App\Mcp\Servers\ZodiakServer;
use Laravel\Mcp\Facades\Mcp;

// Served under /api so the existing nginx rule sends it to Laravel
Mcp::web('/api/mcp', ZodiakServer::class)->middleware([EnsureMcpApiKey::class, 'throttle:60,1']);
