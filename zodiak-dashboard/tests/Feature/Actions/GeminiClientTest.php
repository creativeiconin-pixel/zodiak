<?php

namespace Tests\Feature\Actions;

use App\Actions\GeminiClient;
use Illuminate\Support\Facades\Http;
use RuntimeException;
use Tests\TestCase;

class GeminiClientTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config(['services.gemini.key' => 'AQ.test', 'services.gemini.model' => 'gemini-flash-latest']);
    }

    public function test_attaches_the_image_and_maps_roles(): void
    {
        Http::fake(['*' => Http::response(['candidates' => [['content' => ['parts' => [['text' => '{"ok":true}']]]]]])]);

        $result = app(GeminiClient::class)->json('Be kind', [['role' => 'user', 'content' => 'Hi'], ['role' => 'assistant', 'content' => 'Hello'], ['role' => 'user', 'content' => 'Read my palm']], ['type' => 'object'], ['data' => 'jpeg-bytes', 'mime_type' => 'image/jpeg']);

        $this->assertSame(['ok' => true], $result);
        Http::assertSent(fn ($request) => $request['contents'][1]['role'] === 'model'
            && $request['contents'][2]['parts'][0]['inline_data'] === ['mime_type' => 'image/jpeg', 'data' => base64_encode('jpeg-bytes')]
            && $request['contents'][2]['parts'][1]['text'] === 'Read my palm');
    }

    public function test_skips_thought_parts(): void
    {
        Http::fake(['*' => Http::response(['candidates' => [['content' => ['parts' => [['text' => 'thinking...', 'thought' => true], ['text' => '{"answer":1}']]]]]])]);

        $this->assertSame(['answer' => 1], app(GeminiClient::class)->json('x', [['role' => 'user', 'content' => 'q']], []));
    }

    public function test_safety_block_returns_null(): void
    {
        Http::fake(['*' => Http::response(['promptFeedback' => ['blockReason' => 'SAFETY']])]);

        $this->assertNull(app(GeminiClient::class)->json('x', [['role' => 'user', 'content' => 'q']], []));
    }

    public function test_api_error_throws(): void
    {
        Http::fake(['*' => Http::response(['error' => ['message' => 'quota exceeded']], 429)]);

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('quota exceeded');

        app(GeminiClient::class)->json('x', [['role' => 'user', 'content' => 'q']], []);
    }
}
