<?php

namespace App\Http\Controllers;

use App\Actions\RecordAuditLog;
use App\Enums\ActorType;
use App\Enums\OrderStatus;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderFulfilmentController extends Controller
{
    /**
     * Advance an approved order to its next fulfilment stage: consecrated, shipped, then delivered.
     */
    public function store(Request $request, Order $order, RecordAuditLog $recordAuditLog): RedirectResponse
    {
        $nextStatus = $order->status->nextFulfilmentStatus();

        abort_if($nextStatus === null, 409, 'This order has no further fulfilment stage.');

        [$timestampColumn, $action, $outcome] = match ($nextStatus) {
            OrderStatus::Consecrated => ['consecrated_at', 'Consecration Completed', '108 Japa recorded under Pran-Pratishtha; energized yantra card prepared.'],
            OrderStatus::Shipped => ['shipped_at', 'Secured Dispatch', 'Handed to insured tamper-proof courier.'],
            OrderStatus::Delivered => ['delivered_at', 'Sacred Delivery Confirmed', 'Delivered in sanctified silk vault box.'],
        };

        DB::transaction(function () use ($request, $order, $nextStatus, $timestampColumn, $action, $outcome, $recordAuditLog): void {
            $order->forceFill(['status' => $nextStatus, $timestampColumn => now()])->save();

            $recordAuditLog->handle($request->user()->name, ActorType::Priest, $action, "#{$order->reference}", $outcome);
        });

        return back()->with('status', "#{$order->reference}: {$nextStatus->label()}");
    }
}
