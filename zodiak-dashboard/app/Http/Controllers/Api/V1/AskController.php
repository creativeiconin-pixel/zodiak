<?php

namespace App\Http\Controllers\Api\V1;

use Anthropic\Core\Exceptions\APIException;
use App\Actions\AskClaude;
use App\Actions\CheckRemedySuggestion;
use App\Actions\CreditWallet;
use App\Actions\DescribeStoreForPandit;
use App\Actions\DetectCrisisMessage;
use App\Actions\RecordAuditLog;
use App\Actions\SynthesizeVoiceReply;
use App\Actions\TranscribeVoiceNote;
use App\Enums\ActorType;
use App\Enums\FlagType;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreQuestionRequest;
use App\Http\Resources\ChatMessageResource;
use App\Models\ChatMessage;
use App\Models\CreditTransaction;
use App\Models\FlaggedChat;
use App\Models\Remedy;
use App\Models\Seeker;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RuntimeException;

class AskController extends Controller
{
    public function __construct(private DescribeStoreForPandit $store) {}

    private const HISTORY_TURNS = 10;

    private const LANGUAGE_INSTRUCTIONS = [
        'en' => 'Reply in simple English.',
        'hi' => 'Reply in simple Hindi written in Devanagari script.',
        'hinglish' => 'Reply in simple Hinglish: Hindi words written in English (Roman) letters, the way people text in India.',
        'kn' => 'Reply in simple Kannada written in Kannada script.',
    ];

    /**
     * The seeker's recent Ask-AI conversation, oldest first.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $messages = $request->user()->chatMessages()->with('remedy')->latest('id')->limit(30)->get()->reverse()->values();

        return ChatMessageResource::collection($messages);
    }

    /**
     * Answer a question about the seeker's chart.
     */
    public function store(StoreQuestionRequest $request, AskClaude $askClaude, DetectCrisisMessage $detectCrisis, RecordAuditLog $recordAuditLog, SynthesizeVoiceReply $synthesizeVoiceReply, CreditWallet $wallet, TranscribeVoiceNote $transcribe, CheckRemedySuggestion $checkSuggestion): JsonResponse
    {
        /** @var Seeker $seeker */
        $seeker = $request->user();
        $question = trim((string) $request->validated('message'));

        if ($question === '' && $request->hasFile('audio')) {
            $question = (string) $transcribe->handle($request->file('audio'), app()->getLocale());

            if ($question === '') {
                return response()->json([
                    'message' => __('We could not hear any words. Please speak a little louder, or type your question.'),
                    'errors' => ['audio' => [__('We could not hear any words. Please speak a little louder, or type your question.')]],
                ], 422);
            }
        }
        // Keep the latest full chart on the account so Pandit Jii always has it, even if a later request comes without it
        $chart = $request->validated('chart') ?: $seeker->chart_details;
        $seeker->update(['locale' => app()->getLocale(), ...($request->validated('chart') ? ['chart_details' => $request->validated('chart')] : [])]);

        // Someone in distress always gets the helpline answer, even with no credits left
        if ($detectCrisis->matches($question)) {
            $answer = $this->careAnswer();
            $flag = ['flag' => FlagType::Health->value, 'trigger' => 'Self-harm keyword (safety net)', 'summary' => $question];
        } else {
            if (! $askClaude->isConfigured()) {
                return response()->json(['message' => __('Pandit Jii is not available yet. Please try again later.')], 503);
            }

            $cost = $wallet->questionCost();
            $charge = $wallet->spend($seeker, $cost, CreditTransaction::QUESTION, Str::limit($question, 120));

            if ($cost > 0 && $charge === null) {
                return $this->noCredits($seeker, $cost);
            }

            try {
                $answer = $askClaude->answer($this->systemPrompt($seeker, $chart), $this->conversation($seeker, $question), $this->answerSchema($chart));
            } catch (APIException|RuntimeException $exception) {
                Log::warning('Ask AI request failed', ['seeker' => $seeker->id, 'error' => $exception->getMessage()]);
                $wallet->refund($seeker, $charge, 'Pandit Jii could not answer');

                return response()->json(['message' => __('Pandit Jii could not answer right now. Please try again in a minute.'), 'credits' => $seeker->credits], 502);
            }

            if ($answer === null) {
                $wallet->refund($seeker, $charge, 'Question could not be answered');
            }

            $answer ??= $this->noticeAnswer(__('I cannot help with this question. Please ask something else about your chart.'));
            $safety = $answer['safety'] ?? ['flag' => 'none', 'summary' => ''];
            $flag = $safety['flag'] !== 'none' ? ['flag' => $safety['flag'], 'trigger' => 'AI guardrail', 'summary' => $safety['summary'] ?: $question] : null;
        }

        $remedySlug = filled($answer['remedy_slug'] ?? null) ? $answer['remedy_slug'] : null;
        $remedy = $remedySlug ? Remedy::where('slug', $remedySlug)->first() : null;
        // A suggestion the knowledge base does not back is held for a human Pandit before the seeker can buy it
        $problems = $remedy ? $checkSuggestion->problems($remedy, $chart, $seeker) : [];

        $audioPath = $request->file('audio')?->store("voice-notes/{$seeker->id}", 'local');
        // Two voice notes in a row get a voice answer; anything else is answered in text
        $repliesWithVoice = $audioPath && $seeker->chatMessages()->where('role', 'user')->latest('id')->value('audio_path') !== null;

        $reply = DB::transaction(function () use ($request, $seeker, $question, $audioPath, $answer, $remedySlug, $problems, $flag, $recordAuditLog): ChatMessage {
            $seeker->chatMessages()->create([
                'role' => 'user',
                'content' => $question,
                'audio_path' => $audioPath ?: null,
                'audio_duration_ms' => $audioPath ? $request->validated('audio_duration_ms') : null,
                'waveform' => $audioPath ? $request->validated('waveform') : null,
                'is_flagged' => $flag !== null,
            ]);
            $reply = $seeker->chatMessages()->create([
                'role' => 'assistant',
                'content' => json_encode($answer, JSON_UNESCAPED_UNICODE),
                'remedy_slug' => $remedySlug,
                'is_flagged' => $flag !== null,
                'review_status' => $problems === [] ? null : ChatMessage::REVIEW_PENDING,
                'review_reasons' => $problems === [] ? null : $problems,
            ]);

            if ($flag !== null) {
                $this->escalate($seeker, $reply, $flag, $recordAuditLog);
            }

            if ($problems !== []) {
                $recordAuditLog->handle('AI System (Pandit Jii)', ActorType::Ai, 'Held Product Suggestion', "#CT-{$reply->id}", "Suggested {$remedySlug}; knowledge-base check failed, waiting for a Pandit: ".implode(' ', $problems));
            }

            return $reply;
        });

        // Care messages stay as text so the helpline number is easy to read
        if ($repliesWithVoice && ($answer['kind'] ?? null) !== 'care') {
            $voice = $synthesizeVoiceReply->handle(trim(($answer['short_answer'] ?? '').' '.($answer['practical_step'] ?? '')), app()->getLocale(), "voice-notes/{$seeker->id}");

            if ($voice !== null) {
                $reply->update(['audio_path' => $voice['path'], 'audio_duration_ms' => $voice['duration_ms'], 'waveform' => $voice['waveform']]);
            }
        }

        $question = $seeker->chatMessages()->where('role', 'user')->latest('id')->first();

        return response()->json([
            'question' => new ChatMessageResource($question),
            'data' => new ChatMessageResource($reply->load('remedy')),
            'credits' => $seeker->credits,
        ], 201);
    }

    /**
     * 402 Payment Required: the app shows a "Recharge" button.
     */
    private function noCredits(Seeker $seeker, int $cost): JsonResponse
    {
        return response()->json([
            'message' => __('You have no credits left. Please recharge to ask Pandit Jii.'),
            'code' => 'no_credits',
            'credits' => $seeker->credits,
            'cost' => $cost,
        ], 402);
    }

    /**
     * @param  array{flag: string, trigger: string, summary: string}  $flag
     */
    private function escalate(Seeker $seeker, ChatMessage $reply, array $flag, RecordAuditLog $recordAuditLog): void
    {
        $flagType = FlagType::from($flag['flag']);
        $sessionReference = "#CT-{$reply->id}";

        FlaggedChat::create([
            'user_name' => $seeker->name,
            'user_reference' => "#US-{$seeker->id}",
            'session_reference' => $sessionReference,
            'flag_type' => $flagType,
            'trigger_label' => $flag['trigger'],
            'transit_axis' => $seeker->chart ? "{$seeker->chart['mahadasha']}-{$seeker->chart['antardasha']} period" : 'Chart not saved',
            'summary' => $flag['summary'],
            'action_taken' => $flagType === FlagType::Health
                ? 'Shared Tele-MANAS helpline (14416); astrological prediction withheld.'
                : 'Declined to predict the legal outcome; standard counselling disclaimer shown.',
            'flagged_at' => now(),
        ]);

        $recordAuditLog->handle('AI System (Pandit Jii)', ActorType::Ai, 'Auto-Flagged Sensitive Chat', $sessionReference, "Routed to human follow-up: {$flagType->label()}.");
    }

    /**
     * @param  array<string, mixed>|null  $chart
     * @return list<array{type: string, text: string, cacheControl?: array<string, string>}>
     */
    private function systemPrompt(Seeker $seeker, ?array $chart): array
    {
        // Only a known birth time gives a reliable rising sign to filter the shop by
        $catalog = $this->store->guide($this->risingSign($chart));

        $stable = <<<PROMPT
        You are "Pandit Jii", the AI astrologer inside Zodiak, an Indian astrology app. You explain a person's Vedic birth chart (sidereal zodiac, Lahiri ayanamsa, whole-sign houses, Vimshottari dasha). Speak like a kind, respectful family pandit. If asked, say honestly that you are an AI; the human Pandits in the app are the ones who check remedies before they are sent.

        Write for a 5th-standard reader: short sentences, everyday words, and a plain explanation in brackets the first time you use a Sanskrit term, like "Lagna (your rising sign)". Be warm and calm.

        Ground every answer in the chart data you are given. Never invent placements or dates; if the chart does not cover something, say so. Speak in tendencies ("your chart suggests", "traditionally this is read as") because astrology offers perspective, not certainty. Offer one practical everyday step. Free practices such as a mantra, charity, or a daily routine are welcome.

        Shop suggestions. You may suggest at most one product from the shop guide below, and only when all of these are true:
        1. The question is about something the product's "Best for" covers.
        2. The person's chart matches its "Suits these charts" (rising sign, weak planet, or current dasha). Without a chart, only suggest products that suit every chart.
        3. Nothing in its "Avoid when" matches their chart or the remedies they already ordered.
        Each product's "Fit for this person" line is worked out from their rising sign: prefer products marked GOOD. Products that do not suit their rising sign have already been removed from the guide.
        When you suggest one, put its slug in remedy_slug, say in one simple sentence which chart fact it fits, and include its key wearing step in practical_step. Mention a trial when the guide asks for one. A senior Pandit checks every order against the chart before anything is made, and the seeker gets a full refund if it does not suit them. Never say a product guarantees a result, never pressure the person, and do not suggest something they already ordered. For general questions most answers need no product; a free practice is often the better advice. But when the person directly asks which gemstone, rudraksha or product to use, check every product against the three rules: suggest the one that fits best, or if none fits, say so kindly and explain why.

        Shop guide:
        {$catalog}

        Safety rules:
        - Do not predict death, lifespan, serious illness, accidents, or the outcome of court cases. Do not give medical, legal, or money instructions; suggest a qualified professional for those.
        - If the person seems to be in danger of hurting themselves or in deep distress, set safety.flag to "health", answer with kindness, encourage them to talk to someone they trust and to call Tele-MANAS on 14416 (free, 24x7, India), and leave astrology out of it.
        - If they want a guaranteed legal outcome or an astrological excuse for something dishonest, set safety.flag to "legal" and kindly decline the prediction.
        - Otherwise safety.flag is "none" and safety.summary is an empty string.
        PROMPT;

        return [
            ['type' => 'text', 'text' => $stable, 'cacheControl' => ['type' => 'ephemeral']],
            ['type' => 'text', 'text' => $this->seekerContext($seeker, $chart)],
        ];
    }

    /**
     * @param  array<string, mixed>|null  $chart
     */
    private function seekerContext(Seeker $seeker, ?array $chart): string
    {
        $fallback = self::LANGUAGE_INSTRUCTIONS[app()->getLocale()] ?? self::LANGUAGE_INSTRUCTIONS['en'];
        $language = 'Reply in the same language and script as the person\'s latest message, whatever language the app is set to: '
            .'Hinglish (Hindi words in English letters, like "meri shaadi kab hogi") gets a simple Hinglish reply in English letters; '
            .'Hindi in Devanagari gets simple Hindi in Devanagari; Kannada gets simple Kannada in Kannada script; English gets simple English. '
            ."Write follow_ups in that same language. If you cannot tell the language: {$fallback}";
        $lines = [$language, "The person's name is {$seeker->name}".($seeker->gender ? " ({$seeker->gender})" : '').'. Today is '.now('Asia/Kolkata')->format('j F Y').'.'];

        if ($seeker->hasBirthDetails()) {
            $lines[] = 'Born '.$seeker->birth_date->format('j F Y').' at '.($seeker->birth_time_unknown ? 'an unknown time' : $seeker->birth_time).", {$seeker->birth_place}.";
        }

        $lines = [...$lines, ...$this->palmContext($seeker), ...$this->orderContext($seeker)];

        if ($chart === null) {
            $lines[] = 'Their birth chart is not available. Answer generally, and suggest they make their free birth chart in the app for a personal reading.';

            return implode("\n", $lines);
        }

        $lines[] = 'Their chart:';
        $lines[] = "- Lagna (rising sign): {$chart['ascendant']}".(($chart['birth_time_known'] ?? true) ? '' : ' (approximate: birth time unknown, so Lagna and houses are uncertain)');
        $lines[] = "- Moon nakshatra: {$chart['moon_nakshatra']}";
        $lines[] = "- Current period: {$chart['mahadasha']} mahadasha, {$chart['antardasha']} antardasha".(isset($chart['antardasha_until']) ? " until {$chart['antardasha_until']}" : '');

        foreach ($chart['planets'] as $planet) {
            $retrograde = $planet['retrograde'] && ! in_array($planet['name'], ['Rahu', 'Ketu'], true) ? ', retrograde' : '';
            $lines[] = sprintf('- %s: %s %.1f°, house %d, %s nakshatra, %s%s', $planet['name'], $planet['sign'], $planet['degree'], $planet['house'], $planet['nakshatra'], $planet['dignity'], $retrograde);
        }

        return implode("\n", $lines);
    }

    /**
     * The seeker's latest palm reading, so Pandit Jii can connect palm and chart.
     *
     * @return list<string>
     */
    private function palmContext(Seeker $seeker): array
    {
        $reading = $seeker->palmReadings()->latest()->first();

        if ($reading === null || ! is_array($reading->result)) {
            return [];
        }

        $lines = ["Their latest palm reading ({$reading->hand} hand, ".$reading->created_at->format('j M Y').'):'];

        if (filled($reading->result['summary'] ?? null)) {
            $lines[] = '- Summary: '.$reading->result['summary'];
        }

        foreach ((array) ($reading->result['lines'] ?? []) as $name => $line) {
            if (is_array($line) && ($line['present'] ?? true) && filled($line['meaning'] ?? null)) {
                $lines[] = "- {$name} line: {$line['meaning']}";
            }
        }

        return $lines;
    }

    /**
     * Remedies the seeker has ordered, so Pandit Jii doesn't suggest them again and can explain how to wear them.
     *
     * @return list<string>
     */
    private function orderContext(Seeker $seeker): array
    {
        $orders = $seeker->orders()->with('remedy.knowledge')->latest()->limit(5)->get();

        if ($orders->isEmpty()) {
            return [];
        }

        $lines = ['Remedies they have ordered: '.$orders->map(fn ($order) => "{$order->remedy->name} ({$order->status->label()})")->implode('; ').'.'];

        // So Pandit Jii can explain how to wear what they bought
        foreach ($orders->unique('remedy_id') as $order) {
            if (filled($order->remedy->knowledge?->how_to_use)) {
                $lines[] = "- How to wear {$order->remedy->name}: {$order->remedy->knowledge->how_to_use}";
            }
        }

        return $lines;
    }

    /**
     * Recent turns plus the new question. Earlier answers are replayed as plain text.
     *
     * @return list<array{role: string, content: string}>
     */
    private function conversation(Seeker $seeker, string $question): array
    {
        $history = $seeker->chatMessages()->latest('id')->limit(self::HISTORY_TURNS * 2)->get()->reverse()
            ->map(function (ChatMessage $message): array {
                if ($message->role === 'user') {
                    return ['role' => 'user', 'content' => $message->content];
                }

                $answer = json_decode($message->content, true) ?? [];

                return ['role' => 'assistant', 'content' => trim(($answer['short_answer'] ?? '')."\n".($answer['practical_step'] ?? ''))];
            })
            ->values()
            ->all();

        // The API expects the conversation to start with the seeker
        while ($history !== [] && $history[0]['role'] !== 'user') {
            array_shift($history);
        }

        return [...$history, ['role' => 'user', 'content' => $question]];
    }

    /**
     * @param  array<string, mixed>|null  $chart
     */
    private function risingSign(?array $chart): ?string
    {
        return DescribeStoreForPandit::risingSign($chart);
    }

    /**
     * @param  array<string, mixed>|null  $chart
     * @return array<string, mixed>
     */
    private function answerSchema(?array $chart): array
    {
        $slugs = $this->store->suggestable($this->risingSign($chart))->pluck('slug')->all();

        return [
            'type' => 'object',
            'properties' => [
                'kind' => ['type' => 'string', 'enum' => ['reading', 'care', 'notice'], 'description' => '"reading" for a normal chart answer, "care" when safety.flag is "health".'],
                'short_answer' => ['type' => 'string', 'description' => 'The direct answer in 2-3 short sentences.'],
                'chart_points' => [
                    'type' => 'array',
                    'description' => 'Up to 3 chart facts the answer is based on.',
                    'items' => [
                        'type' => 'object',
                        'properties' => [
                            'placement' => ['type' => 'string', 'description' => 'A short label such as "Jupiter in 10th house".'],
                            'meaning' => ['type' => 'string', 'description' => 'One simple sentence on what it traditionally suggests.'],
                        ],
                        'required' => ['placement', 'meaning'],
                        'additionalProperties' => false,
                    ],
                ],
                'practical_step' => ['type' => 'string', 'description' => 'One everyday thing they can do.'],
                'confidence' => ['type' => 'string', 'enum' => ['low', 'moderate', 'high'], 'description' => 'How firmly the chart supports this reading. Lower when it depends on exact birth time or far-future timing.'],
                'remedy_slug' => ['type' => 'string', 'enum' => ['', ...$slugs], 'description' => 'A shop remedy that truly fits, or an empty string.'],
                'follow_ups' => ['type' => 'array', 'items' => ['type' => 'string'], 'description' => '2-3 short follow-up questions the person might ask next, in their language.'],
                'safety' => [
                    'type' => 'object',
                    'properties' => [
                        'flag' => ['type' => 'string', 'enum' => ['none', 'health', 'legal']],
                        'summary' => ['type' => 'string', 'description' => 'For a flagged chat, one English sentence for the human Pandit team; otherwise empty.'],
                    ],
                    'required' => ['flag', 'summary'],
                    'additionalProperties' => false,
                ],
            ],
            'required' => ['kind', 'short_answer', 'chart_points', 'practical_step', 'confidence', 'remedy_slug', 'follow_ups', 'safety'],
            'additionalProperties' => false,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function careAnswer(): array
    {
        return [
            'kind' => 'care',
            'short_answer' => __('I am really sorry you are feeling this way. You are not alone, and you deserve help right now.'),
            'chart_points' => [],
            'practical_step' => __('Please call Tele-MANAS on 14416. It is free and open day and night. You can also talk to someone you trust today.'),
            'confidence' => 'high',
            'remedy_slug' => '',
            'follow_ups' => [],
            'safety' => ['flag' => 'health', 'summary' => ''],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function noticeAnswer(string $text): array
    {
        return [
            'kind' => 'notice',
            'short_answer' => $text,
            'chart_points' => [],
            'practical_step' => '',
            'confidence' => 'low',
            'remedy_slug' => '',
            'follow_ups' => [],
            'safety' => ['flag' => 'none', 'summary' => ''],
        ];
    }
}
