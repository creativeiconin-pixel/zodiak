<?php

namespace Tests\Feature\Http\Controllers;

use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Remedy;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tests\TestCase;

class ProductControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login(): void
    {
        $this->get(route('products.index'))->assertRedirect(route('login'));
        $this->post(route('products.store'))->assertRedirect(route('login'));
    }

    public function test_lists_products_with_paid_sales_only(): void
    {
        $ring = Remedy::factory()->create(['name' => 'Ruby Ring', 'price' => 9000, 'cost_price' => 5000, 'stock' => 4]);
        Order::factory()->for($ring)->create(['amount' => 9000, 'payment_status' => PaymentStatus::Captured]);
        Order::factory()->for($ring)->create(['amount' => 9000, 'payment_status' => PaymentStatus::Refunded]);
        Remedy::factory()->create(['name' => 'Shri Yantra', 'category' => 'yantras']);

        $this->actingAs(User::factory()->create())
            ->get(route('products.index'))
            ->assertOk()
            ->assertSee('Ruby Ring')
            ->assertSee('Shri Yantra')
            ->assertSee('₹4,000')
            ->assertViewHas('products', fn ($products) => $products->firstWhere('name', 'Ruby Ring')->units_sold === 1
                && (int) $products->firstWhere('name', 'Ruby Ring')->revenue === 9000);
    }

    public function test_search_and_category_filter(): void
    {
        Remedy::factory()->create(['name' => 'Ruby Ring', 'category' => 'gemstones']);
        Remedy::factory()->create(['name' => 'Shri Yantra', 'category' => 'yantras']);
        $user = User::factory()->create();

        $this->actingAs($user)->get(route('products.index', ['category' => 'yantras']))
            ->assertSee('Shri Yantra')->assertDontSee('Ruby Ring');

        $this->actingAs($user)->get(route('products.index', ['q' => 'ruby']))
            ->assertSee('Ruby Ring')->assertDontSee('Shri Yantra');
    }

    public function test_create_page_renders(): void
    {
        $this->actingAs(User::factory()->create())
            ->get(route('products.create'))
            ->assertOk()
            ->assertSee('Add product');
    }

    public function test_store_validates_required_fields(): void
    {
        $this->actingAs(User::factory()->create())
            ->from(route('products.create'))
            ->post(route('products.store'), ['price' => 500, 'compare_at_price' => 400, 'category' => 'toys'])
            ->assertRedirect(route('products.create'))
            ->assertSessionHasErrors(['name', 'category', 'tagline', 'cost_price', 'compare_at_price', 'planet_label', 'assurance_label', 'image']);

        $this->assertDatabaseCount('remedies', 0);
    }

    public function test_store_uploads_the_photo_and_makes_a_unique_slug(): void
    {
        Storage::fake('public');
        Remedy::factory()->create(['slug' => 'ruby-ring']);

        $this->actingAs(User::factory()->create())
            ->post(route('products.store'), $this->validPayload(['image' => UploadedFile::fake()->image('ruby.jpg', 600, 600)]))
            ->assertRedirect(route('knowledge.edit', 'ruby-ring-2'))
            ->assertSessionHasNoErrors();

        $product = Remedy::where('slug', 'ruby-ring-2')->firstOrFail();
        $this->assertSame('Ruby Ring', $product->name);
        $this->assertSame(6500, $product->cost_price);
        $this->assertNull($product->stock);
        $this->assertTrue($product->is_active);
        $this->assertSame(['icon' => 'wb_sunny', 'label' => 'Surya • Sun'], $product->planet);
        $this->assertSame([['icon' => 'check_circle', 'label' => 'Confidence']], $product->benefits);
        $this->assertNull($product->badge);
        $this->assertSame('Ruby Ring', $product->image_alt);
        $this->assertStringStartsWith('/uploads/products/', $product->image);
        Storage::disk('public')->assertExists(Str::after($product->image, '/uploads/'));
    }

    public function test_store_rejects_files_that_are_not_images(): void
    {
        Storage::fake('public');

        $this->actingAs(User::factory()->create())
            ->post(route('products.store'), $this->validPayload(['image' => UploadedFile::fake()->create('notes.pdf', 100, 'application/pdf')]))
            ->assertSessionHasErrors('image');
    }

    public function test_update_keeps_translations_and_photo(): void
    {
        $product = Remedy::factory()->create([
            'slug' => 'ruby-ring',
            'image' => '/images/red-coral.jpg',
            'translations' => ['hi' => ['name' => 'माणिक अंगूठी'], 'kn' => ['name' => 'ಮಾಣಿಕ್ಯ ಉಂಗುರ']],
        ]);

        $this->actingAs(User::factory()->create())
            ->get(route('products.edit', $product))
            ->assertOk()
            ->assertSee('Hindi/Hinglish/Kannada text for this product is kept; edit English here.');

        $this->actingAs(User::factory()->create())
            ->put(route('products.update', $product), $this->validPayload(['slug' => '', 'price' => 12000, 'stock' => 3, 'is_active' => '0']))
            ->assertRedirect(route('products.index'))
            ->assertSessionHasNoErrors();

        $product->refresh();
        $this->assertSame('ruby-ring', $product->slug);
        $this->assertSame(12000, $product->price);
        $this->assertSame(3, $product->stock);
        $this->assertFalse($product->is_active);
        $this->assertSame('/images/red-coral.jpg', $product->image);
        $this->assertSame('माणिक अंगूठी', $product->translations['hi']['name']);
        $this->assertSame('ಮಾಣಿಕ್ಯ ಉಂಗುರ', $product->translations['kn']['name']);
    }

    public function test_update_rejects_a_slug_used_by_another_product(): void
    {
        Remedy::factory()->create(['slug' => 'taken']);
        $product = Remedy::factory()->create(['slug' => 'mine']);

        $this->actingAs(User::factory()->create())
            ->put(route('products.update', $product), $this->validPayload(['slug' => 'taken']))
            ->assertSessionHasErrors('slug');
    }

    public function test_toggle_hides_the_product_from_the_app(): void
    {
        $product = Remedy::factory()->create(['slug' => 'ruby-ring']);
        $user = User::factory()->create();

        $this->actingAs($user)
            ->from(route('products.index'))
            ->post(route('products.toggle', $product))
            ->assertRedirect(route('products.index'));

        $this->assertFalse($product->fresh()->is_active);
        $this->getJson('/api/v1/remedies')->assertOk()->assertJsonCount(0, 'data');
        $this->getJson('/api/v1/remedies/ruby-ring')->assertNotFound();

        $this->actingAs($user)->post(route('products.toggle', $product));

        $this->getJson('/api/v1/remedies')->assertJsonPath('data.0.slug', 'ruby-ring');
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function validPayload(array $overrides = []): array
    {
        return [
            'name' => 'Ruby Ring',
            'category' => 'gemstones',
            'tagline' => 'Ratna Vidya Verified',
            'origin' => 'Origin: Burma',
            'price' => 11000,
            'compare_at_price' => 13000,
            'cost_price' => 6500,
            'stock' => '',
            'price_note' => 'Inc. Pooja & Astrological Box',
            'specification' => '18k Gold • 3 Ratti',
            'planet_label' => 'Surya • Sun',
            'planet_icon' => 'wb_sunny',
            'badge_label' => '',
            'benefits' => [['label' => 'Confidence', 'icon' => ''], ['label' => '', 'icon' => '']],
            'assurance_label' => 'Lab certified',
            'is_active' => '1',
            ...$overrides,
        ];
    }
}
