<?php

namespace App\Actions;

use App\Models\Order;

/**
 * Decides how seekers pay and builds the UPI QR details for an order.
 *
 * Priority: UPI QR (manual UTR verification) when a UPI ID is set, then Pine Labs, otherwise sandbox.
 */
class PaymentInstructions
{
    public function __construct(private PineLabsClient $pineLabs) {}

    /**
     * @return 'upi'|'pinelabs'|'sandbox'
     */
    public function mode(): string
    {
        return match (true) {
            filled(config('services.upi.vpa')) => 'upi',
            $this->pineLabs->isConfigured() => 'pinelabs',
            default => 'sandbox',
        };
    }

    /**
     * Everything the app needs to show a UPI QR: the payee, the amount and a upi:// link with the order number as the note.
     *
     * @return array{upi_id: string, payee_name: string, amount: int, note: string, link: string}
     */
    public function upiFor(Order $order): array
    {
        return $this->upi($order->amount, $order->reference);
    }

    /**
     * UPI QR details for any payment, with our reference (order or credit recharge number) as the note.
     *
     * @return array{upi_id: string, payee_name: string, amount: int, note: string, link: string}
     */
    public function upi(int $amount, string $reference): array
    {
        $vpa = (string) config('services.upi.vpa');
        $payee = (string) (config('services.upi.payee_name') ?: 'Zodiak');
        $note = "Zodiak {$reference}";

        return [
            'upi_id' => $vpa,
            'payee_name' => $payee,
            'amount' => $amount,
            'note' => $note,
            'link' => 'upi://pay?'.http_build_query(['pa' => $vpa, 'pn' => $payee, 'am' => number_format($amount, 2, '.', ''), 'cu' => 'INR', 'tn' => $note], '', '&', PHP_QUERY_RFC3986),
        ];
    }
}
