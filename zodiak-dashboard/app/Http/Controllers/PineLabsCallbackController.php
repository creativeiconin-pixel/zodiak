<?php

namespace App\Http\Controllers;

use App\Actions\SyncPineLabsPayment;
use App\Enums\OrderStatus;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;

class PineLabsCallbackController extends Controller
{
    /**
     * Pine Labs returns the seeker's browser here after checkout. The redirect data is ignored; the real status is fetched server-side.
     */
    public function __invoke(Order $order, SyncPineLabsPayment $syncPineLabsPayment): RedirectResponse
    {
        $order = $syncPineLabsPayment->handle($order);
        $result = match ($order->status) {
            OrderStatus::PaymentFailed => 'failed',
            OrderStatus::PaymentPending => 'pending',
            default => 'success',
        };

        return redirect()->away(rtrim(config('app.frontend_url'), '/')."/orders/{$order->reference}?payment={$result}");
    }
}
