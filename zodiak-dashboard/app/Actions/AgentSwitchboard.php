<?php

namespace App\Actions;

use App\Enums\ActorType;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;

/**
 * On/off switches for Zodiak's AI agents, flipped from the Op-Center Agents page. A paused agent politely
 * turns requests away (and takes no credits) until someone resumes it.
 */
class AgentSwitchboard
{
    private const CACHE_KEY = 'agent-pauses';

    private const KEY_PREFIX = 'agent.paused.';

    /**
     * The agents that can be paused, with what each one does.
     *
     * @var array<string, array{name: string, icon: string, does: string}>
     */
    public const AGENTS = [
        'pandit' => ['name' => 'Pandit Jii', 'icon' => 'psychology', 'does' => 'Answers seekers\' questions from their chart, palm reading, orders and the store knowledge base.'],
        'palm' => ['name' => 'Palm reader', 'icon' => 'front_hand', 'does' => 'Reads the life, head, heart and fate lines from a palm photo.'],
        'listener' => ['name' => 'Voice-note listener', 'icon' => 'hearing', 'does' => 'Writes down what a seeker says in a voice note so Pandit Jii can answer it.'],
        'voice' => ['name' => 'Voice replies', 'icon' => 'graphic_eq', 'does' => 'Speaks Pandit Jii\'s answer back as a voice note (ElevenLabs).'],
        'mcp' => ['name' => 'Outside agents (MCP)', 'icon' => 'hub', 'does' => 'Lets AgenticOrg and other AI agents read Zodiak\'s orders, payments, products and knowledge base.'],
    ];

    public function __construct(private RecordAuditLog $recordAuditLog) {}

    public function isPaused(string $agent): bool
    {
        return array_key_exists($agent, $this->pauses());
    }

    /**
     * Who paused the agent and when, or null while it runs.
     *
     * @return array{by: string, at: Carbon}|null
     */
    public function pausedBy(string $agent): ?array
    {
        $pause = $this->pauses()[$agent] ?? null;

        return $pause === null ? null : ['by' => $pause['by'], 'at' => Carbon::parse($pause['at'])];
    }

    public function pause(string $agent, User $by): void
    {
        Setting::updateOrCreate(['key' => self::KEY_PREFIX.$agent], [
            'value' => json_encode(['by' => $by->name, 'at' => now()->toIso8601String()]),
            'updated_by' => $by->id,
        ]);
        $this->changed($agent, $by, 'Agent Paused', 'Paused from the Agents page; requests are turned away politely.');
    }

    public function resume(string $agent, User $by): void
    {
        Setting::where('key', self::KEY_PREFIX.$agent)->delete();
        $this->changed($agent, $by, 'Agent Resumed', 'Running again.');
    }

    private function changed(string $agent, User $by, string $action, string $outcome): void
    {
        Cache::forget(self::CACHE_KEY);
        $this->recordAuditLog->handle($by->name, ActorType::Pandit, $action, '#AGENT-'.strtoupper($agent), self::AGENTS[$agent]['name'].': '.$outcome);
    }

    /**
     * @return array<string, array{by: string, at: string}>
     */
    private function pauses(): array
    {
        try {
            return Cache::rememberForever(self::CACHE_KEY, fn (): array => Setting::where('key', 'like', self::KEY_PREFIX.'%')->get()
                ->mapWithKeys(fn (Setting $setting) => [substr($setting->key, strlen(self::KEY_PREFIX)) => json_decode($setting->value, true)])
                ->filter(fn ($pause) => is_array($pause))
                ->all());
        } catch (QueryException) {
            return [];
        }
    }
}
