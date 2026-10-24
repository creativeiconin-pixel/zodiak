<?php

namespace App\Mcp\Servers;

use App\Mcp\Tools\BusinessSummaryTool;
use App\Mcp\Tools\GetKnowledgeBaseTool;
use App\Mcp\Tools\GetOrderTool;
use App\Mcp\Tools\ListOrdersTool;
use App\Mcp\Tools\ListProductsTool;
use App\Mcp\Tools\PaymentQueueTool;
use Laravel\Mcp\Server;
use Laravel\Mcp\Server\Attributes\Instructions;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Attributes\Version;

#[Name('Zodiak')]
#[Version('1.0.0')]
#[Instructions('Read-only access to the Zodiak astrology store: sales and profit, orders, the UPI payment check queue, store products and the Pandit Jii knowledge base (what each product is for and the guide the AI reads). All money is in Indian rupees (INR). Customer phone numbers, addresses and birth details are never shared.')]
class ZodiakServer extends Server
{
    protected array $tools = [
        BusinessSummaryTool::class,
        ListOrdersTool::class,
        GetOrderTool::class,
        PaymentQueueTool::class,
        ListProductsTool::class,
        GetKnowledgeBaseTool::class,
    ];

    protected array $resources = [
        //
    ];

    protected array $prompts = [
        //
    ];
}
