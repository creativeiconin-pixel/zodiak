<?php

namespace App\Enums;

enum FlagType: string
{
    case Health = 'health';
    case Legal = 'legal';

    public function label(): string
    {
        return match ($this) {
            self::Health => 'Critical Health Flag',
            self::Legal => 'Legal Conflict Flag',
        };
    }

    public function icon(): string
    {
        return match ($this) {
            self::Health => 'emergency',
            self::Legal => 'gavel',
        };
    }
}
