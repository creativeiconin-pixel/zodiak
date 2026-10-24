<?php

namespace App\Http\Controllers;

use App\Http\Requests\SaveProductRequest;
use App\Models\Remedy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\View\View;

class ProductController extends Controller
{
    /**
     * Every product in the shop with price, cost, stock and how much it has sold.
     */
    public function index(Request $request): View
    {
        $search = trim((string) $request->query('q', ''));
        $category = (string) $request->query('category', '');

        $products = Remedy::query()
            ->when($search !== '', fn (Builder $query) => $query->where(fn (Builder $inner) => $inner
                ->where('name', 'like', "%{$search}%")
                ->orWhere('slug', 'like', "%{$search}%")))
            ->when(array_key_exists($category, SaveProductRequest::CATEGORIES), fn (Builder $query) => $query->where('category', $category))
            ->withCount(['orders as units_sold' => fn (Builder $query) => $query->paid()])
            ->withSum(['orders as revenue' => fn (Builder $query) => $query->paid()], 'amount')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->paginate(25)
            ->withQueryString();

        return view('products.index', [
            'products' => $products,
            'search' => $search,
            'category' => $category,
            'categories' => SaveProductRequest::CATEGORIES,
            'totals' => [
                'all' => Remedy::count(),
                'active' => Remedy::active()->count(),
                'out_of_stock' => Remedy::where('stock', 0)->count(),
            ],
        ]);
    }

    public function create(): View
    {
        return view('products.create', [
            'product' => new Remedy(['is_active' => true, 'accent' => 'primary', 'sort_order' => Remedy::max('sort_order') + 1]),
            'categories' => SaveProductRequest::CATEGORIES,
        ]);
    }

    public function store(SaveProductRequest $request): RedirectResponse
    {
        $product = Remedy::create([
            ...$request->productAttributes(),
            'image' => $this->storeImage($request->file('image')),
            'translations' => [],
        ]);

        // Next step: tell Pandit Jii when to suggest it, or he will rarely recommend it
        return to_route('knowledge.edit', $product)->with('status', "{$product->name} was added to the shop. Now tell Pandit Jii when to suggest it.");
    }

    public function edit(Remedy $product): View
    {
        return view('products.edit', [
            'product' => $product,
            'categories' => SaveProductRequest::CATEGORIES,
        ]);
    }

    /**
     * Save the English details; Hindi, Hinglish and Kannada translations are left as they are.
     */
    public function update(SaveProductRequest $request, Remedy $product): RedirectResponse
    {
        $product->fill($request->productAttributes());

        if ($request->hasFile('image')) {
            $product->image = $this->storeImage($request->file('image'));
        }

        $product->save();

        return to_route('products.index')->with('status', "{$product->name} was saved.");
    }

    /**
     * Switch a product on or off in the app.
     */
    public function toggle(Remedy $product): RedirectResponse
    {
        $product->update(['is_active' => ! $product->is_active]);

        return back()->with('status', $product->is_active ? "{$product->name} is now shown in the app." : "{$product->name} is now hidden from the app.");
    }

    /**
     * Save the photo on the public disk and return the URL path that nginx serves it from (/uploads → storage/app/public).
     */
    private function storeImage(UploadedFile $image): string
    {
        return '/uploads/'.$image->store('products', 'public');
    }
}
