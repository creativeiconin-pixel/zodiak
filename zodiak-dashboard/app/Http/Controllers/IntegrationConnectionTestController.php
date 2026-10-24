<?php

namespace App\Http\Controllers;

use App\Actions\TestIntegrationConnection;
use Illuminate\Http\RedirectResponse;

class IntegrationConnectionTestController extends Controller
{
    public function store(string $integration, TestIntegrationConnection $testIntegrationConnection): RedirectResponse
    {
        abort_unless(config("integrations.{$integration}.testable", false), 404);

        $result = $testIntegrationConnection->handle($integration);

        return back()->with('connection_test', [...$result, 'integration' => $integration]);
    }
}
