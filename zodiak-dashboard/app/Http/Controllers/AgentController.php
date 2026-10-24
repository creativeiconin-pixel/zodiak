<?php

namespace App\Http\Controllers;

use App\Actions\AgentSwitchboard;
use App\Actions\AskClaude;
use App\Actions\GeminiClient;
use App\Actions\ReadPalm;
use App\Models\ChatMessage;
use App\Models\FlaggedChat;
use App\Models\PalmReading;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class AgentController extends Controller
{
    /**
     * How the AI agents work together, each one's status and today's work, with a pause switch per agent.
     */
    public function index(AgentSwitchboard $agents, AskClaude $askClaude, ReadPalm $readPalm, GeminiClient $gemini): View
    {
        $startOfToday = Carbon::now('Asia/Kolkata')->startOfDay()->setTimezone(config('app.timezone'));
        $setUp = [
            'pandit' => $askClaude->isConfigured(),
            'palm' => $readPalm->isConfigured(),
            'listener' => $gemini->isConfigured(),
            'voice' => filled(config('services.elevenlabs.key')) && filled(config('services.elevenlabs.voice_id')),
            'mcp' => filled(config('services.mcp.key')),
        ];
        $today = fn ($query) => $query->where('created_at', '>=', $startOfToday);

        $stats = [
            'pandit' => [ChatMessage::where('role', 'assistant')->tap($today)->count().' answers today', ChatMessage::where('role', 'assistant')->count().' all time'],
            'palm' => [PalmReading::query()->tap($today)->count().' readings today', PalmReading::count().' all time'],
            'listener' => [ChatMessage::where('role', 'user')->whereNotNull('audio_path')->tap($today)->count().' voice notes today', 'Gemini writes down the words'],
            'voice' => [ChatMessage::where('role', 'assistant')->whereNotNull('audio_path')->tap($today)->count().' voice replies today', $setUp['voice'] ? 'ElevenLabs voice' : 'Needs an ElevenLabs key'],
            'mcp' => [$setUp['mcp'] ? 'API key is set' : 'No API key yet', 'Read-only access'],
        ];

        $cards = collect(AgentSwitchboard::AGENTS)->map(fn (array $agent, string $slug) => [
            ...$agent,
            'slug' => $slug,
            'state' => ! $setUp[$slug] ? 'off' : ($agents->isPaused($slug) ? 'paused' : 'running'),
            'paused' => $agents->pausedBy($slug),
            'stats' => $stats[$slug],
        ]);

        return view('agents.index', [
            'cards' => $cards,
            'safety' => [
                'care' => FlaggedChat::query()->tap($today)->count(),
                'held' => ChatMessage::awaitingReview()->count(),
            ],
        ]);
    }

    /**
     * Pause or resume one agent.
     */
    public function update(Request $request, string $agent, AgentSwitchboard $agents): RedirectResponse
    {
        abort_unless(array_key_exists($agent, AgentSwitchboard::AGENTS), 404);
        $validated = $request->validate(['state' => ['required', Rule::in(['paused', 'running'])]]);
        $name = AgentSwitchboard::AGENTS[$agent]['name'];

        if ($validated['state'] === 'paused') {
            $agents->pause($agent, $request->user());

            return back()->with('status', "{$name} is paused. Seekers get a polite \"please try later\" message and no credits are taken.");
        }

        $agents->resume($agent, $request->user());

        return back()->with('status', "{$name} is running again.");
    }
}
