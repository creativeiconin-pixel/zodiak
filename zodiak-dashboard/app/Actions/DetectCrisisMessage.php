<?php

namespace App\Actions;

use Illuminate\Support\Str;

/**
 * A deterministic safety net for messages that suggest self-harm. It runs before the AI is called,
 * so a seeker in crisis always gets helpline details even if the AI is unavailable.
 */
class DetectCrisisMessage
{
    /**
     * Phrases in English, Hindi, Hinglish and Kannada. Matching is case-insensitive.
     *
     * @var list<string>
     */
    private const PHRASES = [
        'suicide', 'kill myself', 'end my life', 'want to die', "don't want to live", 'dont want to live', 'self harm', 'hurt myself',
        'आत्महत्या', 'खुदकुशी', 'मरना चाहता', 'मरना चाहती', 'जीना नहीं चाहता', 'जीना नहीं चाहती', 'अपनी जान',
        'aatmahatya', 'atmahatya', 'khudkushi', 'marna chahta', 'marna chahti', 'jeena nahi chahta', 'jeena nahi chahti', 'apni jaan',
        'ಆತ್ಮಹತ್ಯೆ', 'ಸಾಯಬೇಕು', 'ಸಾಯಲು ಬಯಸ', 'ಬದುಕಲು ಇಷ್ಟವಿಲ್ಲ', 'saayabeku',
    ];

    public function matches(string $message): bool
    {
        return Str::contains(Str::lower($message), self::PHRASES);
    }
}
