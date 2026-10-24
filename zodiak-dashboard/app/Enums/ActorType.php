<?php

namespace App\Enums;

enum ActorType: string
{
    case Pandit = 'pandit';
    case Ai = 'ai';
    case Priest = 'priest';
    case Gateway = 'gateway';
    case Seeker = 'seeker';
}
