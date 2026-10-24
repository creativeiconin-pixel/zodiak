<?php

namespace App\Http\Resources;

use App\Models\PalmReading;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin PalmReading
 */
class PalmReadingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => 'reading',
            'hand' => $this->hand,
            'locale' => $this->locale,
            'summary' => $this->result['summary'] ?? '',
            'lines' => $this->result['lines'] ?? [],
            'mounts' => $this->result['mounts'] ?? [],
            'tip' => $this->result['tip'] ?? '',
            'confidence' => $this->result['confidence'] ?? 'low',
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
