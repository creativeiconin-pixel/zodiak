<?php

namespace App\Models;

use Database\Factories\SeekerFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;

/**
 * A seeker is a customer of the Zodiak app. They authenticate through the separate "seeker" guard,
 * so a seeker session can never reach the pandit dashboard.
 */
#[Fillable([
    'name', 'email', 'phone', 'password', 'gender', 'locale', 'birth_date', 'birth_time', 'birth_time_unknown', 'birth_place',
    'birth_latitude', 'birth_longitude', 'birth_timezone', 'chart', 'chart_details',
])]
#[Hidden(['password', 'remember_token'])]
class Seeker extends Authenticatable
{
    /** @use HasFactory<SeekerFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'birth_date' => 'date:Y-m-d',
            'birth_time_unknown' => 'boolean',
            'birth_latitude' => 'float',
            'birth_longitude' => 'float',
            'chart' => 'array',
            'chart_details' => 'array',
            'credits' => 'integer',
        ];
    }

    /**
     * @return HasMany<Order, $this>
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /**
     * @return HasMany<ChatMessage, $this>
     */
    public function chatMessages(): HasMany
    {
        return $this->hasMany(ChatMessage::class);
    }

    /**
     * @return HasMany<PalmReading, $this>
     */
    public function palmReadings(): HasMany
    {
        return $this->hasMany(PalmReading::class);
    }

    /**
     * @return HasMany<CreditTransaction, $this>
     */
    public function creditTransactions(): HasMany
    {
        return $this->hasMany(CreditTransaction::class);
    }

    /**
     * @return HasMany<CreditRecharge, $this>
     */
    public function creditRecharges(): HasMany
    {
        return $this->hasMany(CreditRecharge::class);
    }

    public function hasBirthDetails(): bool
    {
        return $this->birth_date !== null && $this->birth_place !== null;
    }
}
