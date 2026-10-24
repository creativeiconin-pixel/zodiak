<?php

namespace App\Http\Resources;

use App\Actions\PaymentInstructions;
use App\Enums\PaymentStatus;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Public view of an order for the seeker's tracking page. Contact and address details are deliberately omitted.
 *
 * @mixin Order
 */
class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'reference' => $this->reference,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'journey_step' => $this->status->journeyStep(),
            'payment_status' => $this->payment_status->value,
            'payment_method' => $this->payment_gateway,
            'payment_utr' => $this->payment_utr,
            'payment_note' => $this->payment_note,
            'payment_submitted_at' => $this->payment_submitted_at?->toIso8601String(),
            // QR details while a UPI order still needs paying (or a new UTR after a failed check)
            'upi' => $this->when(
                $this->payment_gateway === 'upi' && in_array($this->payment_status, [PaymentStatus::AwaitingPayment, PaymentStatus::Failed], true) && filled(config('services.upi.vpa')),
                fn () => app(PaymentInstructions::class)->upiFor($this->resource),
            ),
            'amount' => $this->amount,
            'specification' => $this->specification,
            'customer_name' => $this->customer_name,
            'gotra' => $this->gotra,
            'lagna' => $this->lagna,
            'nakshatra' => $this->nakshatra,
            'muhurat' => $this->muhurat,
            'chart_compatibility' => $this->chart_compatibility,
            'reviewer' => $this->whenLoaded('reviewer', fn () => $this->reviewer?->only(['name', 'title'])),
            'reviewed_at' => $this->reviewed_at?->toIso8601String(),
            'consecrated_at' => $this->consecrated_at?->toIso8601String(),
            'shipped_at' => $this->shipped_at?->toIso8601String(),
            'delivered_at' => $this->delivered_at?->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
            'remedy' => new RemedyResource($this->whenLoaded('remedy')),
        ];
    }
}
