<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Resend, Postmark, AWS, and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    // Which AI answers as Pandit Jii and reads palms: "gemini" or "claude"
    'ai' => [
        'provider' => env('AI_PROVIDER', 'gemini'),
    ],

    'gemini' => [
        'key' => env('GEMINI_API_KEY'),
        'model' => env('GEMINI_MODEL', 'gemini-flash-lite-latest'),
    ],

    'anthropic' => [
        'key' => env('ANTHROPIC_API_KEY'),
        'model' => env('ANTHROPIC_MODEL', 'claude-opus-5-5'),
    ],

    // Credits pay for Pandit Jii answers and palm readings; packs are "credits=price in rupees"
    'credits' => [
        'signup_bonus' => env('CREDITS_SIGNUP_BONUS', 30),
        'per_question' => env('CREDITS_PER_QUESTION', 1),
        'per_palm_reading' => env('CREDITS_PER_PALM_READING', 5),
        'packs' => env('CREDITS_PACKS', '50=49, 120=99, 300=199'),
    ],

    'mcp' => [
        'key' => env('MCP_API_KEY'),
    ],

    'agenticorg' => [
        'base_url' => env('AGENTICORG_BASE_URL', 'https://app.agenticorg.ai'),
        'key' => env('AGENTICORG_API_KEY'),
    ],

    'elevenlabs' => [
        'key' => env('ELEVENLABS_API_KEY'),
        'voice_id' => env('ELEVENLABS_VOICE_ID'),
        'model_id' => env('ELEVENLABS_MODEL_ID', 'eleven_v3'),
    ],

    'upi' => [
        'vpa' => env('UPI_ID'),
        'payee_name' => env('UPI_PAYEE_NAME', 'Zodiak'),
    ],

    'pinelabs' => [
        'environment' => env('PINELABS_ENVIRONMENT', 'uat'),
        'base_url' => env('PINELABS_BASE_URL', 'https://pluraluat.v2.pinepg.in'),
        'merchant_id' => env('PINELABS_MERCHANT_ID'),
        'client_id' => env('PINELABS_CLIENT_ID'),
        'client_secret' => env('PINELABS_CLIENT_SECRET'),
    ],

    'msg91' => [
        'auth_key' => env('MSG91_AUTH_KEY'),
        'template_id' => env('MSG91_OTP_TEMPLATE_ID'),
    ],

    'otp' => [
        'debug' => env('OTP_DEBUG', false),
    ],

];
