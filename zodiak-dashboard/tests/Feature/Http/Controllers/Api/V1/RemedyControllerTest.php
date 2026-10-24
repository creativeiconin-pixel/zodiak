<?php

namespace Tests\Feature\Http\Controllers\Api\V1;

use App\Models\Remedy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RemedyControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_remedies_in_display_order(): void
    {
        Remedy::factory()->create(['slug' => 'second', 'sort_order' => 2]);
        Remedy::factory()->create(['slug' => 'first', 'sort_order' => 1]);

        $this->getJson('/api/v1/remedies')
            ->assertOk()
            ->assertJsonPath('data.0.slug', 'first')
            ->assertJsonPath('data.1.slug', 'second');
    }

    public function test_show_returns_the_remedy_by_slug(): void
    {
        $remedy = Remedy::factory()->create(['slug' => 'ceylon-yellow-sapphire-ring', 'price' => 14999]);

        $this->getJson('/api/v1/remedies/ceylon-yellow-sapphire-ring')
            ->assertOk()
            ->assertJsonPath('data.name', $remedy->name)
            ->assertJsonPath('data.price', 14999);
    }

    public function test_show_returns_404_for_an_unknown_slug(): void
    {
        $this->getJson('/api/v1/remedies/missing')->assertNotFound();
    }
}
