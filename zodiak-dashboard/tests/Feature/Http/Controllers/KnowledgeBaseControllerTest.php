<?php

namespace Tests\Feature\Http\Controllers;

use App\Actions\DescribeStoreForPandit;
use App\Models\Remedy;
use App\Models\RemedyKnowledge;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class KnowledgeBaseControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get(route('knowledge.index'))->assertRedirect(route('login'));
    }

    public function test_lists_products_with_their_knowledge_and_the_guide(): void
    {
        $described = RemedyKnowledge::factory()->create(['best_for' => 'Growth in work and wisdom.']);
        $empty = Remedy::factory()->create(['name' => 'Ruby Ring']);

        $this->actingAs(User::factory()->create())
            ->get(route('knowledge.index'))
            ->assertOk()
            ->assertSee($described->remedy->name)
            ->assertSee('Growth in work and wisdom.')
            ->assertSee('Ruby Ring')
            ->assertSee('Pandit Jii knows almost nothing about this product')
            ->assertSee('What Pandit Jii reads');
    }

    public function test_saving_knowledge_creates_it_and_records_the_editor(): void
    {
        $product = Remedy::factory()->create();
        $editor = User::factory()->create(['name' => 'Pandit Sharma']);

        $this->actingAs($editor)
            ->put(route('knowledge.update', $product), [
                'planets' => ['Sun'],
                'best_for' => 'Confidence and government jobs.',
                'suits_charts' => 'Leo and Aries rising; weak Sun.',
                'avoid_when' => 'Taurus, Libra, Capricorn and Aquarius rising.',
                'how_to_use' => 'Gold ring on the ring finger, Sunday morning.',
            ])
            ->assertRedirect(route('knowledge.index'));

        $knowledge = $product->knowledge()->sole();
        $this->assertSame(['Sun'], $knowledge->planets);
        $this->assertSame(5, $knowledge->completeness());
        $this->assertTrue($knowledge->editor->is($editor));
    }

    public function test_unknown_planets_are_rejected(): void
    {
        $product = Remedy::factory()->create();

        $this->actingAs(User::factory()->create())
            ->put(route('knowledge.update', $product), ['planets' => ['Pluto']])
            ->assertSessionHasErrors('planets.0');
    }

    public function test_guide_uses_knowledge_and_leaves_out_hidden_and_sold_out_products(): void
    {
        RemedyKnowledge::factory()->create(['avoid_when' => 'Never with Blue Sapphire.', 'remedy_id' => Remedy::factory()->create(['slug' => 'pukhraj'])]);
        Remedy::factory()->create(['slug' => 'hidden-ring', 'is_active' => false]);
        Remedy::factory()->create(['slug' => 'sold-out-ring', 'stock' => 0]);
        Remedy::factory()->create(['slug' => 'no-notes-ring']);

        $guide = app(DescribeStoreForPandit::class)->guide();

        $this->assertStringContainsString('[pukhraj]', $guide);
        $this->assertStringContainsString('Avoid when: Never with Blue Sapphire.', $guide);
        $this->assertStringContainsString('[no-notes-ring]', $guide);
        $this->assertStringContainsString('has not written guidance', $guide);
        $this->assertStringNotContainsString('hidden-ring', $guide);
        $this->assertStringNotContainsString('sold-out-ring', $guide);
    }

    public function test_products_avoided_for_a_rising_sign_are_left_out_for_that_person(): void
    {
        RemedyKnowledge::factory()->create(['remedy_id' => Remedy::factory()->create(['slug' => 'pukhraj']), 'good_signs' => ['Sagittarius'], 'avoid_signs' => ['Taurus']]);
        RemedyKnowledge::factory()->create(['remedy_id' => Remedy::factory()->create(['slug' => 'neelam']), 'good_signs' => ['Taurus'], 'avoid_signs' => ['Sagittarius']]);
        $store = app(DescribeStoreForPandit::class);

        $this->assertSame(['neelam'], $store->suggestable('Taurus')->pluck('slug')->all());
        $this->assertStringContainsString('Fit for this person: GOOD', $store->guide('Taurus'));
        $this->assertStringNotContainsString('[pukhraj]', $store->guide('Taurus'));
        $this->assertSame(['pukhraj'], $store->suggestable('Sagittarius')->pluck('slug')->all());
        $this->assertCount(2, $store->suggestable());
        $this->assertSame('Taurus', DescribeStoreForPandit::signOf("Taurus 10°00'"));
        $this->assertNull(DescribeStoreForPandit::signOf('Unknown'));
    }

    public function test_a_sign_cannot_be_both_good_and_avoided(): void
    {
        $product = Remedy::factory()->create();

        $this->actingAs(User::factory()->create())
            ->put(route('knowledge.update', $product), ['good_signs' => ['Leo'], 'avoid_signs' => ['Leo', 'Virgo']])
            ->assertSessionHasErrors('avoid_signs');
    }

    public function test_preview_for_a_rising_sign_shows_what_pandit_jii_reads(): void
    {
        RemedyKnowledge::factory()->create(['remedy_id' => Remedy::factory()->create(['slug' => 'pukhraj']), 'avoid_signs' => ['Taurus']]);

        $this->actingAs(User::factory()->create())->get(route('knowledge.index', ['sign' => 'Taurus']))->assertOk()->assertDontSee('[pukhraj]');
        $this->actingAs(User::factory()->create())->get(route('knowledge.index', ['sign' => 'Leo']))->assertOk()->assertSee('[pukhraj]');
    }
}
