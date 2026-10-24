<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\AgentSwitchboard;
use App\Actions\AskClaude;
use App\Actions\CreditWallet;
use App\Actions\IssueLoginCode;
use App\Actions\PaymentInstructions;
use App\Actions\PineLabsClient;
use App\Actions\SynthesizeVoiceReply;
use App\Actions\TranscribeVoiceNote;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class AppConfigController extends Controller
{
    /**
     * Which integrations are switched on, so the app can show the right messages. Never exposes keys.
     */
    public function __invoke(AskClaude $askClaude, PaymentInstructions $payments, PineLabsClient $pineLabs, SynthesizeVoiceReply $synthesizeVoiceReply, IssueLoginCode $issueLoginCode, TranscribeVoiceNote $transcribe, CreditWallet $wallet, AgentSwitchboard $agents): JsonResponse
    {
        return response()->json([
            'data' => [
                'payments' => $payments->mode(),
                'payments_environment' => $payments->mode() === 'pinelabs' ? config('services.pinelabs.environment') : null,
                'ai' => $askClaude->isConfigured() && ! $agents->isPaused('pandit'),
                'voice_replies' => $synthesizeVoiceReply->isConfigured(),
                'voice_transcription' => $transcribe->isAvailable(),
                'phone_login' => $issueLoginCode->canDeliver(),
                'signup_bonus' => $wallet->signupBonus(),
            ],
        ]);
    }
}
