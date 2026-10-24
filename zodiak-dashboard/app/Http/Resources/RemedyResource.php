<?php

namespace App\Http\Resources;

use App\Models\Remedy;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Remedy
 */
class RemedyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'category' => $this->category,
            'image' => $this->image,
            'image_alt' => $this->image_alt,
            'accent' => $this->accent,
            'price' => $this->price,
            'compare_at_price' => $this->compare_at_price,
            ...$this->localized(app()->getLocale()),
        ];
    }
}
