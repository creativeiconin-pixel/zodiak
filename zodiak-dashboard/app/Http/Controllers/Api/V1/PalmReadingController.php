<?php

namespace App\Http\Controllers\Api\V1;

use Anthropic\Core\Exceptions\APIException;
use App\Actions\CreditWallet;
use App\Actions\PreparePalmPhoto;
use App\Actions\ReadPalm;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePalmReadingRequest;
use App\Http\Resources\PalmReadingResource;
use App\Models\CreditTransaction;
use App\Models\Seeker;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use RuntimeException;

class PalmReadingController extends Controller
{
    private const LANGUAGE_INSTRUCTIONS = [
        'en' => 'Write every text field in simple English.',
        'hi' => 'Write every text field in simple Hindi using Devanagari script.',
        'hinglish' => 'Write every text field in simple Hinglish: Hindi words written in English (Roman) letters, the way people text in India.',
        'kn' => 'Write every text field in simple Kannada using Kannada script.',
    ];

    private const MOUNTS = ['jupiter', 'saturn', 'sun', 'mercury', 'venus', 'moon', 'mars'];

    private const RETAKE_REASONS = ['too_dark', 'blurry', 'not_a_palm', 'fingers_closed', 'hand_cut_off', 'unclear'];

    private const HISTORY_LIMIT = 5;

    /**
     * The seeker's latest palm readings, newest first.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        return PalmReadingResource::collection(
            $request->user()->palmReadings()->latest('id')->limit(self::HISTORY_LIMIT)->get()
        );
    }

    /**
     * Read a palm photo. The photo is only held in memory for this request and is never stored;
     * only the AI's structured reading is saved.
     */
    public function store(StorePalmReadingRequest $request, ReadPalm $readPalm, PreparePalmPhoto $preparePhoto, CreditWallet $wallet): JsonResponse
    {
        /** @var Seeker $seeker */
        $seeker = $request->user();
        $hand = $request->validated('hand');

        if (! $readPalm->isConfigured()) {
            return response()->json(['message' => __('The AI palm reader is not switched on yet. Please try again later.')], 503);
        }

        $upload = $request->file('image');

        try {
            $photo = $preparePhoto->handle($upload->getContent(), $upload->getMimeType());
        } catch (InvalidArgumentException) {
            return response()->json([
                'message' => __('We could not open this photo. Please choose a JPEG or PNG photo.'),
                'errors' => ['image' => [__('We could not open this photo. Please choose a JPEG or PNG photo.')]],
            ], 422);
        }

        // Credits are taken up front and given back if the photo can't be read, so a retake is free
        $cost = $wallet->palmReadingCost();
        $charge = $wallet->spend($seeker, $cost, CreditTransaction::PALM_READING, ucfirst($hand).' hand');

        if ($cost > 0 && $charge === null) {
            return response()->json([
                'message' => __('You need :cost credits for a palm reading. Please recharge.', ['cost' => $cost]),
                'code' => 'no_credits',
                'credits' => $seeker->credits,
                'cost' => $cost,
            ], 402);
        }

        try {
            $reading = $readPalm->read(
                $this->systemPrompt($request->validated('chart_summary')),
                $photo['data'],
                $photo['mediaType'],
                "This is a photo of my {$hand} hand. First check that it clearly shows an open palm, then read it.",
                $this->readingSchema(),
            );
        } catch (APIException|RuntimeException $exception) {
            Log::warning('Palm reading failed', ['seeker' => $seeker->id, 'error' => $exception->getMessage()]);
            $wallet->refund($seeker, $charge, 'Palm reader could not answer');

            return response()->json(['message' => __('The AI palm reader could not read this photo right now. Please try again in a minute.')], 502);
        }

        if ($reading === null || ($reading['status'] ?? 'retake') !== 'reading') {
            $wallet->refund($seeker, $charge, 'Palm photo needs a retake');

            return response()->json(['data' => $this->retake($hand, $reading), 'credits' => $seeker->credits]);
        }

        $palmReading = $seeker->palmReadings()->create([
            'hand' => $hand,
            'locale' => app()->getLocale(),
            'result' => [
                'summary' => $reading['summary'],
                'lines' => $reading['lines'],
                'mounts' => array_slice($reading['mounts'], 0, 4),
                'tip' => $reading['tip'],
                'confidence' => $reading['confidence'],
            ],
        ]);

        return (new PalmReadingResource($palmReading))->additional(['credits' => $seeker->credits])->response()->setStatusCode(201);
    }

    /**
     * A "please take another photo" answer. Nothing is stored for these.
     *
     * @param  array<string, mixed>|null  $reading
     * @return array<string, mixed>
     */
    private function retake(string $hand, ?array $reading): array
    {
        $reason = in_array($reading['retake_reason'] ?? null, self::RETAKE_REASONS, true) ? $reading['retake_reason'] : 'unclear';

        return [
            'id' => null,
            'status' => 'retake',
            'hand' => $hand,
            'retake_reason' => $reason,
            'retake_tip' => filled($reading['retake_tip'] ?? null)
                ? $reading['retake_tip']
                : __('We could not read this photo. Please take a clear photo of your open palm.'),
        ];
    }

    /**
     * @return list<array{type: string, text: string, cacheControl?: array<string, string>}>
     */
    private function systemPrompt(?string $chartSummary): array
    {
        $stable = <<<'PROMPT'
        You are the palm reader inside Zodiak, an Indian astrology app. You read palms using traditional Indian palmistry (Samudrika Shastra).

        Step 1 - check the photo. Decide honestly whether it clearly shows an open palm (the inside of the hand, fingers open, lines visible).
        If it does not, set status to "retake", pick the best retake_reason ("too_dark", "blurry", "not_a_palm", "fingers_closed", "hand_cut_off", or "unclear"), write one short friendly retake_tip on how to take a better photo, and leave every reading field empty (empty strings, present false, no mounts, confidence "low").
        If it does, set status to "reading", retake_reason to "" and retake_tip to "".

        Step 2 - read the palm. Describe only what you can really see. If a line is faint or hidden, set present to false and say so kindly instead of guessing.
        - Life line (curves around the thumb): shows energy and big life changes. It does NOT show how long someone lives.
        - Head line (across the middle of the palm): shows how a person thinks, learns and decides.
        - Heart line (below the fingers): shows feelings, love and friendships.
        - Fate line (up the middle towards the middle finger): shows work, duty and direction. Many people have a faint fate line or none, and that is normal.
        Then pick the 2 to 4 mounts (the soft raised pads) that stand out most and give each a simple meaning.

        How to write:
        - Write for a 5th-standard reader: short sentences, everyday words, warm and encouraging.
        - "look" is one short sentence on how the line looks (long, deep, curved, faint, broken, forked...).
        - "meaning" is one or two simple sentences on what it traditionally suggests, in the form of tendencies ("this often shows...", "traditionally this means...").
        - The summary is two or three warm sentences bringing the reading together.
        - The tip is one practical everyday thing the person can do this week.
        - confidence is how clearly you could see the lines: "high" for a sharp, bright photo, "low" when many lines were hard to see.

        Safety rules:
        - Never predict death, lifespan, serious illness, accidents, or anything frightening, even if a line is short, broken or missing. A short or broken line only means change or a fresh start.
        - Do not give medical, legal or money instructions.
        - Palmistry is traditional guidance, not certainty; keep the tone light and hopeful.
        PROMPT;

        $language = self::LANGUAGE_INSTRUCTIONS[app()->getLocale()] ?? self::LANGUAGE_INSTRUCTIONS['en'];
        $context = $language.' Keep the JSON keys and enum values in English.';

        if (filled($chartSummary)) {
            $context .= "\nThe person also shared a short summary of their birth chart. You may gently link one palm sign to it in the summary, but the palm comes first:\n".$chartSummary;
        }

        return [
            ['type' => 'text', 'text' => $stable, 'cacheControl' => ['type' => 'ephemeral']],
            ['type' => 'text', 'text' => $context],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function readingSchema(): array
    {
        $line = [
            'type' => 'object',
            'properties' => [
                'present' => ['type' => 'boolean', 'description' => 'Whether the line can be clearly seen in the photo.'],
                'look' => ['type' => 'string', 'description' => 'One short sentence on how the line looks.'],
                'meaning' => ['type' => 'string', 'description' => 'One or two simple sentences on what it traditionally suggests.'],
            ],
            'required' => ['present', 'look', 'meaning'],
            'additionalProperties' => false,
        ];

        return [
            'type' => 'object',
            'properties' => [
                'status' => ['type' => 'string', 'enum' => ['reading', 'retake']],
                'retake_reason' => ['type' => 'string', 'enum' => ['', ...self::RETAKE_REASONS]],
                'retake_tip' => ['type' => 'string', 'description' => 'For a retake, one short friendly tip for a better photo; otherwise empty.'],
                'summary' => ['type' => 'string', 'description' => 'Two or three warm, simple sentences bringing the reading together.'],
                'lines' => [
                    'type' => 'object',
                    'properties' => ['life' => $line, 'head' => $line, 'heart' => $line, 'fate' => $line],
                    'required' => ['life', 'head', 'heart', 'fate'],
                    'additionalProperties' => false,
                ],
                'mounts' => [
                    'type' => 'array',
                    'description' => 'The 2 to 4 mounts that stand out most. Empty for a retake.',
                    'items' => [
                        'type' => 'object',
                        'properties' => [
                            'mount' => ['type' => 'string', 'enum' => self::MOUNTS],
                            'strength' => ['type' => 'string', 'enum' => ['strong', 'medium', 'soft']],
                            'meaning' => ['type' => 'string', 'description' => 'One simple sentence on what it traditionally suggests.'],
                        ],
                        'required' => ['mount', 'strength', 'meaning'],
                        'additionalProperties' => false,
                    ],
                ],
                'tip' => ['type' => 'string', 'description' => 'One practical everyday thing to do this week.'],
                'confidence' => ['type' => 'string', 'enum' => ['low', 'moderate', 'high']],
            ],
            'required' => ['status', 'retake_reason', 'retake_tip', 'summary', 'lines', 'mounts', 'tip', 'confidence'],
            'additionalProperties' => false,
        ];
    }
}
