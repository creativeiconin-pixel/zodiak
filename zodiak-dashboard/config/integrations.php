<?php

/*
|--------------------------------------------------------------------------
| Dashboard-managed integrations
|--------------------------------------------------------------------------
|
| Each field can be set from the Op-Center Integrations page. A value saved
| there is stored encrypted in the settings table and overrides the matching
| config path (whose default still comes from .env).
|
*/

return [
    'gemini' => [
        'label' => 'Google Gemini (Pandit Jii & palm reading)',
        'icon' => 'auto_awesome',
        'testable' => true,
        'fields' => [
            'ai.provider' => ['label' => 'AI used for Pandit Jii', 'config' => 'services.ai.provider', 'secret' => false, 'placeholder' => 'gemini or claude'],
            'gemini.api_key' => ['label' => 'Gemini API key', 'config' => 'services.gemini.key', 'secret' => true, 'placeholder' => 'AQ.... or AIza...'],
            'gemini.model' => ['label' => 'Gemini model', 'config' => 'services.gemini.model', 'secret' => false, 'placeholder' => 'gemini-flash-lite-latest (fast)'],
        ],
    ],

    'anthropic' => [
        'label' => 'Claude (optional alternative AI)',
        'icon' => 'psychology',
        'testable' => true,
        'fields' => [
            'anthropic.api_key' => ['label' => 'API key', 'config' => 'services.anthropic.key', 'secret' => true, 'placeholder' => 'sk-ant-...'],
            'anthropic.model' => ['label' => 'Model', 'config' => 'services.anthropic.model', 'secret' => false, 'placeholder' => 'claude-opus-5-5'],
        ],
    ],

    'agenticorg' => [
        'label' => 'AgenticOrg (Pine Labs build access)',
        'icon' => 'hub',
        'testable' => true,
        'fields' => [
            'agenticorg.base_url' => ['label' => 'Base URL', 'config' => 'services.agenticorg.base_url', 'secret' => false, 'placeholder' => 'https://app.agenticorg.ai'],
            'agenticorg.api_key' => ['label' => 'API key', 'config' => 'services.agenticorg.key', 'secret' => true, 'placeholder' => 'ao_sk_...'],
        ],
    ],

    'credits' => [
        'label' => 'Credits (free welcome credits, prices and recharge packs)',
        'icon' => 'toll',
        'testable' => false,
        'fields' => [
            'credits.signup_bonus' => ['label' => 'Free credits on first sign-up', 'config' => 'services.credits.signup_bonus', 'secret' => false, 'placeholder' => '30'],
            'credits.per_question' => ['label' => 'Credits for one Pandit Jii answer', 'config' => 'services.credits.per_question', 'secret' => false, 'placeholder' => '1'],
            'credits.per_palm_reading' => ['label' => 'Credits for one palm reading', 'config' => 'services.credits.per_palm_reading', 'secret' => false, 'placeholder' => '5'],
            'credits.packs' => ['label' => 'Recharge packs — credits=price in ₹, comma separated (paid by the UPI QR above)', 'config' => 'services.credits.packs', 'secret' => false, 'placeholder' => '50=49, 120=99, 300=199'],
        ],
    ],

    'mcp' => [
        'label' => 'MCP server (for AgenticOrg and other AI agents)',
        'icon' => 'cable',
        'testable' => false,
        'fields' => [
            'mcp.api_key' => ['label' => 'MCP API key — paste the same key in the agent tool', 'config' => 'services.mcp.key', 'secret' => true, 'placeholder' => 'A long random secret, at least 32 characters'],
        ],
    ],

    'upi' => [
        'label' => 'UPI QR payments (manual UTR check)',
        'icon' => 'qr_code_2',
        'testable' => false,
        'fields' => [
            'upi.vpa' => ['label' => 'UPI ID (VPA)', 'config' => 'services.upi.vpa', 'secret' => false, 'placeholder' => 'yourname@okhdfcbank'],
            'upi.payee_name' => ['label' => 'Name shown in UPI apps', 'config' => 'services.upi.payee_name', 'secret' => false, 'placeholder' => 'Zodiak'],
        ],
    ],

    'elevenlabs' => [
        'label' => 'ElevenLabs (AI voice-note replies)',
        'icon' => 'graphic_eq',
        'testable' => true,
        'fields' => [
            'elevenlabs.api_key' => ['label' => 'API key', 'config' => 'services.elevenlabs.key', 'secret' => true, 'placeholder' => 'xi-...'],
            'elevenlabs.voice_id' => ['label' => 'Voice ID', 'config' => 'services.elevenlabs.voice_id', 'secret' => false, 'placeholder' => 'From ElevenLabs → Voices → ID'],
            'elevenlabs.model_id' => ['label' => 'Model', 'config' => 'services.elevenlabs.model_id', 'secret' => false, 'placeholder' => 'eleven_v3 (supports Hindi + Kannada)'],
        ],
    ],

    'pinelabs' => [
        'label' => 'Pine Labs Online (payments)',
        'icon' => 'credit_card',
        'testable' => true,
        'fields' => [
            'pinelabs.environment' => ['label' => 'Environment', 'config' => 'services.pinelabs.environment', 'secret' => false, 'placeholder' => 'uat or production'],
            'pinelabs.base_url' => ['label' => 'API base URL', 'config' => 'services.pinelabs.base_url', 'secret' => false, 'placeholder' => 'UAT https://pluraluat.v2.pinepg.in · Prod https://api.pluralpay.in'],
            'pinelabs.merchant_id' => ['label' => 'Merchant ID', 'config' => 'services.pinelabs.merchant_id', 'secret' => false, 'placeholder' => ''],
            'pinelabs.client_id' => ['label' => 'Client ID', 'config' => 'services.pinelabs.client_id', 'secret' => false, 'placeholder' => ''],
            'pinelabs.client_secret' => ['label' => 'Client secret', 'config' => 'services.pinelabs.client_secret', 'secret' => true, 'placeholder' => ''],
        ],
    ],
    'msg91' => [
        'label' => 'Phone OTP sign-in (demo mode or MSG91 SMS)',
        'icon' => 'sms',
        'testable' => false,
        'fields' => [
            'otp.demo_mode' => ['label' => 'Demo OTP — show the code on screen (anyone can log in with any number)', 'config' => 'services.otp.debug', 'secret' => false, 'type' => 'boolean', 'placeholder' => ''],
            'msg91.auth_key' => ['label' => 'Auth key', 'config' => 'services.msg91.auth_key', 'secret' => true, 'placeholder' => 'From MSG91 → API → Auth key'],
            'msg91.template_id' => ['label' => 'OTP template ID', 'config' => 'services.msg91.template_id', 'secret' => false, 'placeholder' => 'DLT-approved OTP template'],
        ],
    ],
];
