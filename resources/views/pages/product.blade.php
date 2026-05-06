@extends('layouts.app')

@push('schema')
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "{{ $product->name }}",
    "description": "{{ $product->meta_description }}",
    "image": @json($product->images->pluck('url')),
    "sku": "{{ $product->sku }}",
    "brand": { "@type": "Brand", "name": "{{ $product->brand }}" },
    "offers": {
        "@type": "Offer",
        "url": "{{ route('product.show', $product->slug) }}",
        "priceCurrency": "INR",
        "price": "{{ $product->sale_price }}",
        "availability": "{{ $product->in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' }}",
        "seller": { "@type": "Organization", "name": "{{ config('app.name') }}" }
    },
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "{{ $product->avg_rating }}",
        "reviewCount": "{{ $product->reviews_count }}"
    },
    "review": @json($product->reviews->take(5)->map(fn($r) => [
        '@type' => 'Review',
        'reviewRating' => ['@type' => 'Rating', 'ratingValue' => $r->rating],
        'author' => ['@type' => 'Person', 'name' => $r->user->name],
        'reviewBody' => $r->body,
    ]))
}
</script>
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        {"@type":"ListItem","position":1,"name":"Home","item":"{{ route('home') }}"},
        {"@type":"ListItem","position":2,"name":"{{ $product->category->name }}","item":"{{ route('category', $product->category->slug) }}"},
        {"@type":"ListItem","position":3,"name":"{{ $product->name }}","item":"{{ route('product.show', $product->slug) }}"}
    ]
}
</script>
@endpush

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

    {{-- Breadcrumb --}}
    <nav class="flex items-center gap-2 text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <a href="{{ route('home') }}" class="hover:text-primary-600">Home</a>
        <span>/</span>
        <a href="{{ route('category', $product->category->slug) }}" class="hover:text-primary-600">{{ $product->category->name }}</a>
        <span>/</span>
        <span class="text-gray-900 font-medium">{{ $product->name }}</span>
    </nav>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12" x-data="gallery({{ $product->images->pluck('url') }})">

        {{-- Image Gallery --}}
        <div class="space-y-4">
            <div class="aspect-product rounded-2xl overflow-hidden bg-gray-100">
                <img :src="images[active]" :alt="'{{ $product->name }} - Image ' + (active + 1)"
                    class="w-full h-full object-cover" width="600" height="800">
            </div>
            <div class="flex gap-3 overflow-x-auto scrollbar-hide">
                <template x-for="(img, i) in images" :key="i">
                    <button @click="setActive(i)"
                        class="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors"
                        :class="active === i ? 'border-primary-500' : 'border-transparent'">
                        <img :src="img" :alt="'Thumbnail ' + (i+1)" class="w-full h-full object-cover">
                    </button>
                </template>
            </div>
        </div>

        {{-- Product Info --}}
        <div x-data="{
            selectedSize: null,
            selectedColor: null,
            quantity: 1,
            variants: {{ $product->variants->groupBy('size') }},
        }">
            <p class="text-sm text-gray-400 font-medium uppercase tracking-wide">{{ $product->brand }}</p>
            <h1 class="font-display text-3xl font-bold text-gray-900 mt-1">{{ $product->name }}</h1>

            {{-- Rating --}}
            <div class="flex items-center gap-3 mt-3">
                <div class="flex">
                    @for($i = 1; $i <= 5; $i++)
                    <svg class="w-4 h-4 {{ $i <= round($product->avg_rating) ? 'text-yellow-400' : 'text-gray-200' }} fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    @endfor
                </div>
                <a href="#reviews" class="text-sm text-gray-500 hover:text-primary-600">{{ $product->reviews_count }} reviews</a>
            </div>

            {{-- Price --}}
            <div class="flex items-center gap-3 mt-4">
                <span class="text-3xl font-bold text-gray-900">₹{{ number_format($product->sale_price) }}</span>
                @if($product->original_price > $product->sale_price)
                <span class="text-xl text-gray-400 line-through">₹{{ number_format($product->original_price) }}</span>
                <span class="badge bg-red-100 text-red-600">{{ $product->discount_percent }}% OFF</span>
                @endif
            </div>

            {{-- Color Selection --}}
            @if($product->colors->count())
            <div class="mt-6">
                <p class="text-sm font-semibold text-gray-700 mb-3">Color: <span class="font-normal text-gray-500" x-text="selectedColor ?? 'Select'"></span></p>
                <div class="flex gap-2 flex-wrap">
                    @foreach($product->colors as $color)
                    <button
                        @click="selectedColor = '{{ $color->name }}'"
                        class="w-8 h-8 rounded-full border-2 transition-all hover:scale-110"
                        :class="selectedColor === '{{ $color->name }}' ? 'border-primary-500 scale-110' : 'border-gray-200'"
                        style="background-color: {{ $color->hex }}"
                        :aria-label="'{{ $color->name }}'"
                        title="{{ $color->name }}"
                    ></button>
                    @endforeach
                </div>
            </div>
            @endif

            {{-- Size Selection --}}
            <div class="mt-6">
                <div class="flex items-center justify-between mb-3">
                    <p class="text-sm font-semibold text-gray-700">Size: <span class="font-normal text-gray-500" x-text="selectedSize ?? 'Select'"></span></p>
                    <a href="{{ route('size-guide') }}" class="text-xs text-primary-600 hover:underline">Size Guide</a>
                </div>
                <div class="flex gap-2 flex-wrap">
                    @foreach($product->sizes as $size)
                    <button
                        @click="selectedSize = '{{ $size->name }}'"
                        class="px-4 py-2 border-2 rounded-lg text-sm font-medium transition-all"
                        :class="selectedSize === '{{ $size->name }}' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-700 hover:border-gray-400'"
                        {{ $size->stock === 0 ? 'disabled' : '' }}
                    >{{ $size->name }}</button>
                    @endforeach
                </div>
            </div>

            {{-- Quantity --}}
            <div class="mt-6 flex items-center gap-4">
                <p class="text-sm font-semibold text-gray-700">Quantity:</p>
                <div class="flex items-center border border-gray-200 rounded-lg">
                    <button @click="quantity = Math.max(1, quantity - 1)" class="px-3 py-2 text-gray-600 hover:text-primary-600">−</button>
                    <span class="px-4 py-2 font-medium" x-text="quantity"></span>
                    <button @click="quantity = Math.min(10, quantity + 1)" class="px-3 py-2 text-gray-600 hover:text-primary-600">+</button>
                </div>
            </div>

            {{-- CTA Buttons --}}
            <div class="flex gap-3 mt-8">
                <button
                    class="flex-1 btn-primary text-lg py-4"
                    @click="$store.cart.add({{ $product->id }}, null, quantity)"
                    :disabled="!selectedSize"
                    x-text="selectedSize ? 'Add to Cart' : 'Select Size'"
                >Add to Cart</button>
                <button
                    class="w-14 h-14 border-2 border-gray-200 rounded-xl flex items-center justify-center hover:border-red-400 transition-colors"
                    @click="$store.wishlist.toggle({{ $product->id }})"
                    aria-label="Add to wishlist"
                >
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                </button>
            </div>

            {{-- Delivery Info --}}
            <div class="mt-6 p-4 bg-gray-50 rounded-xl space-y-2 text-sm text-gray-600">
                <p>🚚 Free delivery on orders above ₹999</p>
                <p>↩️ Easy 30-day returns</p>
                <p>🔒 Secure payment guaranteed</p>
            </div>

            {{-- Description --}}
            <div class="mt-8 prose prose-sm max-w-none text-gray-600">
                {!! $product->description !!}
            </div>
        </div>
    </div>

    {{-- Reviews --}}
    <section id="reviews" class="mt-16">
        <h2 class="section-title mb-8">Customer Reviews</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center p-8 bg-gray-50 rounded-2xl">
                <div class="text-6xl font-bold text-gray-900">{{ number_format($product->avg_rating, 1) }}</div>
                <div class="flex justify-center mt-2">
                    @for($i = 1; $i <= 5; $i++)
                    <svg class="w-5 h-5 {{ $i <= round($product->avg_rating) ? 'text-yellow-400' : 'text-gray-200' }} fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    @endfor
                </div>
                <p class="text-gray-500 mt-2">{{ $product->reviews_count }} reviews</p>
            </div>
            <div class="md:col-span-2 space-y-4">
                @foreach($product->reviews->take(5) as $review)
                <div class="p-4 border border-gray-100 rounded-xl">
                    <div class="flex items-center justify-between mb-2">
                        <span class="font-medium text-gray-900">{{ $review->user->name }}</span>
                        <span class="text-xs text-gray-400">{{ $review->created_at->format('M d, Y') }}</span>
                    </div>
                    <div class="flex mb-2">
                        @for($i = 1; $i <= 5; $i++)
                        <svg class="w-4 h-4 {{ $i <= $review->rating ? 'text-yellow-400' : 'text-gray-200' }} fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        @endfor
                    </div>
                    <p class="text-sm text-gray-600">{{ $review->body }}</p>
                </div>
                @endforeach
            </div>
        </div>
    </section>

    {{-- Related Products --}}
    <section class="mt-16">
        <h2 class="section-title mb-8">You May Also Like</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            @foreach($relatedProducts as $product)
                @include('components.product-card', compact('product'))
            @endforeach
        </div>
    </section>
</div>
@endsection
