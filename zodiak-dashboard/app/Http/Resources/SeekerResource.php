<?php

namespace App\Http\Resources;

use App\Models\Seeker;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Seeker
 */
class SeekerResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'gender' => $this->gender,
            'locale' => $this->locale,
            'birth' => $this->hasBirthDetails() ? [
                'date' => $this->birth_date->format('Y-m-d'),
                'time' => $this->birth_time,
                'time_unknown' => $this->birth_time_unknown,
                'place' => $this->birth_place,
                'latitude' => $this->birth_latitude,
                'longitude' => $this->birth_longitude,
                'timezone' => $this->birth_timezone,
            ] : null,
            'chart' => $this->chart,
            'credits' => (int) $this->credits,
        ];
    }
}
