<?php

namespace Tests\Feature\Mcp;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Mcp\Servers\ZodiakServer;
use App\Mcp\Tools\BusinessSummaryTool;
use App\Mcp\Tools\GetKnowledgeBaseTool;
use App\Mcp\Tools\GetOrderTool;
use App\Mcp\Tools\ListOrdersTool;
use App\Mcp\Tools\ListProductsTool;
use App\Mcp\Tools\PaymentQueueTool;
use App\Models\Order;
use App\Models\Remedy;
use App\Models\RemedyKnowledge;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;
use Tests\TestCase;

class ZodiakServerTest extends TestCase
{
    use RefreshDatabase;

    private const KEY = 'test-mcp-key-0123456789abcdefghijklmnop';

    private function initialize(array $headers): TestResponse
    {
        return $this->postJson('/api/mcp', [
            'jsonrpc' => '2.0',
            'id' => 1,
            'method' => 'initialize',
            'params' => ['protocolVersion' => '2025-06-18', 'capabilities' => (object) [], 'clientInfo' => ['name' => 'test', 'version' => '1']],
        ], $headers + ['Accept' => 'application/json, text/event-stream']);
    }

    public function test_endpoint_is_off_until_a_key_is_set(): void
    {
        config(['services.mcp.key' => null]);

        $this->initialize(['Authorization' => 'Bearer anything'])->assertStatus(503);
    }

    public function test_wrong_or_missing_key_is_rejected(): void
    {
        config(['services.mcp.key' => self::KEY]);

        $this->initialize([])->assertUnauthorized();
        $this->initialize(['Authorization' => 'Bearer wrong'])->assertUnauthorized();
    }

    public function test_bearer_and_x_api_key_headers_are_accepted(): void
    {
        config(['services.mcp.key' => self::KEY]);

        $this->initialize(['Authorization' => 'Bearer '.self::KEY])->assertOk()->assertJsonPath('result.serverInfo.name', 'Zodiak');
        $this->initialize(['X-API-Key' => self::KEY])->assertOk();
    }

    public function test_business_summary_reports_profit_from_paid_orders(): void
    {
        Order::factory()->create(['amount' => 1000, 'cost_amount' => 400, 'payment_status' => PaymentStatus::Captured]);
        Order::factory()->create(['amount' => 500, 'cost_amount' => 100, 'payment_status' => PaymentStatus::AwaitingPayment, 'status' => OrderStatus::PaymentPending]);

        ZodiakServer::tool(BusinessSummaryTool::class, ['days' => 7])
            ->assertOk()
            ->assertSee(['"revenue":1000', '"profit":600', '"paid_orders":1']);
    }

    public function test_orders_hide_phone_and_address(): void
    {
        $order = Order::factory()->create(['customer_phone' => '9876543210', 'address_line' => '12 Secret Lane']);

        ZodiakServer::tool(ListOrdersTool::class)->assertOk()->assertSee($order->reference)->assertDontSee(['9876543210', '12 Secret Lane']);
        ZodiakServer::tool(GetOrderTool::class, ['reference' => strtolower($order->reference)])->assertOk()->assertSee($order->reference)->assertDontSee('9876543210');
        ZodiakServer::tool(GetOrderTool::class, ['reference' => 'ZK-00000'])->assertHasErrors();
    }

    public function test_payment_queue_lists_utrs_waiting_for_a_check(): void
    {
        Order::factory()->create([
            'status' => OrderStatus::PaymentPending,
            'payment_status' => PaymentStatus::VerificationPending,
            'payment_gateway' => 'upi',
            'payment_utr' => '412356789012',
            'payment_submitted_at' => now(),
        ]);

        ZodiakServer::tool(PaymentQueueTool::class)->assertOk()->assertSee('412356789012');
    }

    public function test_products_include_profit_per_piece(): void
    {
        Remedy::factory()->create(['name' => 'Test Rudraksha', 'price' => 2500, 'cost_price' => 900]);

        ZodiakServer::tool(ListProductsTool::class)->assertOk()->assertSee(['Test Rudraksha', '"profit_per_piece":1600']);
    }

    public function test_knowledge_base_shows_entries_and_the_guide_pandit_jii_reads(): void
    {
        $remedy = Remedy::factory()->create(['slug' => 'yellow-sapphire', 'name' => 'Yellow Sapphire']);
        RemedyKnowledge::factory()->for($remedy)->create(['how_to_use' => 'Gold ring on the index finger.']);
        Remedy::factory()->create(['slug' => 'no-notes-yet', 'name' => 'Plain Bracelet']);

        ZodiakServer::tool(GetKnowledgeBaseTool::class)
            ->assertOk()
            ->assertSee(['Yellow Sapphire', '"completeness":5', 'Gold ring on the index finger.', 'Plain Bracelet', '"completeness":0', '[yellow-sapphire]']);

        // Taurus is on the avoid list, so the guide for a Taurus rising person leaves the product out
        ZodiakServer::tool(GetKnowledgeBaseTool::class, ['sign' => 'Taurus'])->assertOk()->assertDontSee('[yellow-sapphire]');
        ZodiakServer::tool(GetKnowledgeBaseTool::class, ['product' => 'no-notes-yet'])->assertOk()->assertSee('Plain Bracelet')->assertDontSee('"slug":"yellow-sapphire"');
        ZodiakServer::tool(GetKnowledgeBaseTool::class, ['product' => 'missing'])->assertHasErrors();
        ZodiakServer::tool(GetKnowledgeBaseTool::class, ['sign' => 'Ophiuchus'])->assertHasErrors();
        ZodiakServer::tool(GetKnowledgeBaseTool::class, ['product' => '', 'sign' => ''])->assertOk()->assertSee('Yellow Sapphire');
    }
}
