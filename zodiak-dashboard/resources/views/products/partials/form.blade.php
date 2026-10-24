{{-- Shared add/edit product form. Expects: $product (Remedy, may be unsaved), $categories, $action, $method --}}
@php
    $isNew = ! $product->exists;
    $inputClass = 'w-full px-space-md py-2.5 rounded-lg bg-surface-container-lowest/80 text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-secondary font-body-md text-body-md';
    $sectionClass = 'p-space-lg rounded-2xl bg-surface-container-low shadow-xl';
    $headingClass = 'font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs mb-space-md';
    $savedBenefits = $product->benefits ?? [];
@endphp

@if ($errors->any())
    <div class="relative z-10 mb-space-md px-space-md py-3 rounded-xl bg-error-container/30 text-error" role="alert">
        <p class="font-label-lg text-label-lg mb-1">Please fix these and save again:</p>
        <ul class="list-disc pl-5 font-body-md text-body-md">
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<form method="POST" action="{{ $action }}" enctype="multipart/form-data" class="relative z-10 flex flex-col gap-5">
    @csrf
    @if ($method !== 'POST')
        @method($method)
    @endif

    @unless ($isNew)
        <div class="flex items-start gap-space-sm px-space-md py-3 rounded-xl bg-secondary-container/20 text-on-surface-variant">
            <span class="material-symbols-outlined text-secondary">translate</span>
            <p class="font-body-md text-body-md">Hindi/Hinglish/Kannada text for this product is kept; edit English here.</p>
        </div>
    @endunless

    {{-- Basics --}}
    <section class="{{ $sectionClass }}">
        <h2 class="{{ $headingClass }}"><span class="material-symbols-outlined text-primary">sell</span> Basics</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            @include('products.partials.input', ['name' => 'name', 'label' => 'Product name', 'value' => $product->name, 'required' => true, 'placeholder' => 'Yellow Sapphire (Pukhraj) Ring', 'hint' => null])
            @include('products.partials.input', ['name' => 'slug', 'label' => 'Web address (slug)', 'value' => $product->slug, 'placeholder' => 'yellow-sapphire-ring', 'hint' => $isNew ? 'Leave empty to make it from the name.' : 'Changing it breaks old links to this product.'])

            <div class="space-y-1.5">
                <label for="field-category" class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Category<span class="text-error" aria-hidden="true"> *</span></label>
                <select id="field-category" name="category" required class="{{ $inputClass }} @error('category') ring-1 ring-error @enderror">
                    @foreach ($categories as $categoryKey => $categoryName)
                        <option value="{{ $categoryKey }}" @selected(old('category', $product->category) === $categoryKey)>{{ $categoryName }}</option>
                    @endforeach
                </select>
                @error('category')<p class="font-body-sm text-body-sm text-error">{{ $message }}</p>@enderror
            </div>
            <div class="space-y-1.5">
                <label for="field-accent" class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Card colour</label>
                <select id="field-accent" name="accent" class="{{ $inputClass }}">
                    <option value="primary" @selected(old('accent', $product->accent) === 'primary')>Gold</option>
                    <option value="secondary" @selected(old('accent', $product->accent) === 'secondary')>Purple</option>
                </select>
            </div>

            @include('products.partials.input', ['name' => 'tagline', 'label' => 'Tagline', 'value' => $product->tagline, 'required' => true, 'placeholder' => 'Ratna Vidya Verified', 'hint' => null])
            @include('products.partials.input', ['name' => 'origin', 'label' => 'Origin', 'value' => $product->origin, 'required' => true, 'placeholder' => 'Origin: Ceylon (Sri Lanka)', 'hint' => null])
            <div class="md:col-span-2">
                @include('products.partials.input', ['name' => 'specification', 'label' => 'Specification', 'value' => $product->specification, 'required' => true, 'placeholder' => '18k Gold • 4.25 Ratti', 'hint' => null])
            </div>
        </div>
    </section>

    {{-- Price & stock --}}
    <section class="{{ $sectionClass }}">
        <h2 class="{{ $headingClass }}"><span class="material-symbols-outlined text-primary">currency_rupee</span> Price, cost &amp; stock</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
            @include('products.partials.input', ['name' => 'price', 'label' => 'Price (₹)', 'type' => 'number', 'value' => $product->price, 'required' => true, 'placeholder' => '14999', 'hint' => 'What the seeker pays.'])
            @include('products.partials.input', ['name' => 'compare_at_price', 'label' => 'MRP (₹)', 'type' => 'number', 'value' => $product->compare_at_price, 'placeholder' => 'Optional', 'hint' => 'Shown crossed out. Must be more than price.'])
            @include('products.partials.input', ['name' => 'cost_price', 'label' => 'Our cost (₹)', 'type' => 'number', 'value' => $product->cost_price ?? 0, 'required' => true, 'placeholder' => '9000', 'hint' => 'Never shown in the app. Used for profit.'])
            @include('products.partials.input', ['name' => 'stock', 'label' => 'Stock', 'type' => 'number', 'value' => $product->stock, 'placeholder' => 'Unlimited', 'hint' => 'Leave empty for unlimited.'])
        </div>
        <div class="mt-space-md grid grid-cols-1 md:grid-cols-2 gap-space-md">
            @include('products.partials.input', ['name' => 'price_note', 'label' => 'Price note', 'value' => $product->price_note, 'required' => true, 'placeholder' => 'Inc. Pooja & Astrological Box', 'hint' => null])
            @include('products.partials.input', ['name' => 'price_detail', 'label' => 'Price detail', 'value' => $product->price_detail, 'placeholder' => 'Optional, e.g. Per Ratti', 'hint' => null])
        </div>
    </section>

    {{-- Card chips --}}
    <section class="{{ $sectionClass }}">
        <h2 class="{{ $headingClass }}"><span class="material-symbols-outlined text-primary">style</span> Labels on the product card</h2>
        <p class="-mt-2 mb-space-md font-body-sm text-body-sm text-outline">
            Icons are <a href="https://fonts.google.com/icons" target="_blank" rel="noopener" class="text-secondary underline">Material Symbols</a> names such as <code>explore</code>, <code>verified</code>, <code>trending_up</code>.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            <div class="md:col-span-2">@include('products.partials.input', ['name' => 'planet_label', 'label' => 'Planet', 'value' => $product->planet['label'] ?? '', 'required' => true, 'placeholder' => 'Guru • Jupiter', 'hint' => null])</div>
            @include('products.partials.input', ['name' => 'planet_icon', 'label' => 'Planet icon', 'value' => $product->planet['icon'] ?? 'explore', 'placeholder' => 'explore', 'hint' => null])

            <div class="md:col-span-2">@include('products.partials.input', ['name' => 'badge_label', 'label' => 'Badge', 'value' => $product->badge['label'] ?? '', 'placeholder' => 'Optional, e.g. Most loved', 'hint' => null])</div>
            @include('products.partials.input', ['name' => 'badge_icon', 'label' => 'Badge icon', 'value' => $product->badge['icon'] ?? '', 'placeholder' => 'stars', 'hint' => null])

            @foreach (range(0, 2) as $benefitIndex)
                <div class="md:col-span-2">@include('products.partials.input', ['name' => "benefits[{$benefitIndex}][label]", 'errorKey' => "benefits.{$benefitIndex}.label", 'label' => 'Benefit '.($benefitIndex + 1), 'value' => $savedBenefits[$benefitIndex]['label'] ?? '', 'placeholder' => $benefitIndex === 0 ? 'Growth in work' : 'Optional', 'hint' => null])</div>
                @include('products.partials.input', ['name' => "benefits[{$benefitIndex}][icon]", 'errorKey' => "benefits.{$benefitIndex}.icon", 'label' => 'Benefit '.($benefitIndex + 1).' icon', 'value' => $savedBenefits[$benefitIndex]['icon'] ?? '', 'placeholder' => 'check_circle', 'hint' => null])
            @endforeach

            <div class="md:col-span-2">@include('products.partials.input', ['name' => 'assurance_label', 'label' => 'Assurance', 'value' => $product->assurance['label'] ?? '', 'required' => true, 'placeholder' => 'Government lab certificate + pooja by Pandit', 'hint' => null])</div>
            @include('products.partials.input', ['name' => 'assurance_icon', 'label' => 'Assurance icon', 'value' => $product->assurance['icon'] ?? 'verified', 'placeholder' => 'verified', 'hint' => null])
        </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {{-- Photo --}}
        <section class="lg:col-span-2 {{ $sectionClass }}">
            <h2 class="{{ $headingClass }}"><span class="material-symbols-outlined text-primary">image</span> Photo</h2>
            <div class="flex flex-col sm:flex-row gap-space-md">
                <div class="w-32 h-32 rounded-xl bg-surface-container overflow-hidden shrink-0 flex items-center justify-center">
                    @if ($product->image)
                        <img src="{{ $product->image }}" alt="{{ $product->image_alt }}" class="w-full h-full object-cover">
                    @else
                        <span class="material-symbols-outlined text-4xl text-outline">add_photo_alternate</span>
                    @endif
                </div>
                <div class="flex-1 space-y-space-md">
                    <div class="space-y-1.5">
                        <label for="field-image" class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                            {{ $isNew ? 'Upload photo' : 'Replace photo' }}@if ($isNew)<span class="text-error" aria-hidden="true"> *</span>@endif
                        </label>
                        <input id="field-image" name="image" type="file" accept="image/jpeg,image/png,image/webp" @if ($isNew) required @endif
                               class="block w-full font-body-sm text-body-sm text-on-surface-variant file:mr-space-sm file:px-space-md file:py-2 file:rounded-lg file:border-0 file:bg-surface-container-high file:text-on-surface file:font-label-md hover:file:bg-surface-container-highest">
                        @error('image')
                            <p class="font-body-sm text-body-sm text-error">{{ $message }}</p>
                        @else
                            <p class="font-body-sm text-body-sm text-outline">JPG, PNG or WebP, up to 4 MB. {{ $isNew ? '' : 'Leave empty to keep the current photo.' }}</p>
                        @enderror
                    </div>
                    @include('products.partials.input', ['name' => 'image_alt', 'label' => 'Photo description', 'value' => $product->image_alt, 'placeholder' => 'Yellow sapphire ring in gold', 'hint' => 'For screen readers. Leave empty to use the product name.'])
                </div>
            </div>
        </section>

        {{-- Visibility --}}
        <section class="{{ $sectionClass }}">
            <h2 class="{{ $headingClass }}"><span class="material-symbols-outlined text-primary">visibility</span> Visibility</h2>
            <div class="space-y-space-md">
                <label class="flex items-start gap-space-sm p-space-md rounded-xl bg-surface-container cursor-pointer">
                    <input type="hidden" name="is_active" value="0">
                    <input type="checkbox" name="is_active" value="1" @checked(old('is_active', $product->is_active)) class="mt-1 w-4 h-4 accent-primary">
                    <span>
                        <span class="block font-label-lg text-label-lg text-on-surface">Show in the app</span>
                        <span class="block font-body-sm text-body-sm text-outline">Untick to hide it from seekers without deleting it.</span>
                    </span>
                </label>
                @include('products.partials.input', ['name' => 'sort_order', 'label' => 'Position in shop', 'type' => 'number', 'value' => $product->sort_order, 'placeholder' => '0', 'hint' => 'Smaller numbers show first.'])
            </div>
        </section>
    </div>

    <div class="flex items-center justify-end gap-space-sm">
        <a href="{{ route('products.index') }}" class="px-space-lg py-3 rounded-xl text-on-surface-variant font-label-lg text-label-lg hover:bg-surface-container transition-colors">Cancel</a>
        <button type="submit" class="flex items-center gap-space-xs px-space-lg py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg text-label-lg shadow-xl shadow-primary/20 hover:opacity-95 transition-all">
            <span class="material-symbols-outlined text-lg">save</span> {{ $isNew ? 'Add product' : 'Save product' }}
        </button>
    </div>
</form>
