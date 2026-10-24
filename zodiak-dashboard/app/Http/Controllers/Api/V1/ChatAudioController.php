<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ChatMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ChatAudioController extends Controller
{
    /**
     * Audio types by file extension. Browsers recordings are often sniffed as video/*, which iPhones refuse to play as audio.
     */
    private const AUDIO_TYPES = [
        'webm' => 'audio/webm',
        'weba' => 'audio/webm',
        'ogg' => 'audio/ogg',
        'mp4' => 'audio/mp4',
        'm4a' => 'audio/mp4',
        'mov' => 'audio/mp4',
        'aac' => 'audio/aac',
        'mp3' => 'audio/mpeg',
        'mpga' => 'audio/mpeg',
        'wav' => 'audio/wav',
    ];

    /**
     * Send a voice note (the seeker's own or an AI voice reply) to the seeker it belongs to. Anyone else gets a 404.
     *
     * A file response (not a stream) so HTTP Range requests work: iPhone Safari will not play audio without them.
     */
    public function __invoke(Request $request, ChatMessage $chatMessage): BinaryFileResponse
    {
        abort_unless($chatMessage->seeker_id === $request->user()->id && $chatMessage->audio_path !== null, 404);

        $disk = Storage::disk('local');
        abort_unless($disk->exists($chatMessage->audio_path), 404);

        $extension = strtolower(pathinfo($chatMessage->audio_path, PATHINFO_EXTENSION));

        return response()->file($disk->path($chatMessage->audio_path), [
            'Content-Type' => self::AUDIO_TYPES[$extension] ?? 'audio/mpeg',
            'Cache-Control' => 'private, max-age=86400',
        ]);
    }
}
