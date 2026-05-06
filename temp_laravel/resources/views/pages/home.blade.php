@extends('layouts.app')

@push('schema')
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "{{ config('app.name') }}",
    "url": "{{ config('app.url') }}",
    "potentialAction": {
        "@type": "SearchAction",
        "target": "{{ config('app.url') }}/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
    }
}
</script>
@endpush

@section('content')

{{-- Hero --}}
<section class="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden min-h-screen flex items-center">
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="max-w-2xl">
            <span class="inline-block bg-pink-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">New Collection 2025</span>
            <h1 class="font-display text-5xl md:text-7xl font-bold leading-tight">
                Dress Your <span class="text-pink-400">Story</span>
            </h1>
            <p class="mt-6 text-xl text-gray-300 leading-relaxed">
                Discover premium fashion curated for every occasion. From casual to couture.
            </p>
            <div class="flex flex-wrap gap-4 mt-8">
                <a href="{{ route('category', 'women') }}" class="btn-primary text-lg px-8 py-4">Shop Women</a>
                <a href="{{ route('category', 'men') }}" class="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-200 text-lg">Shop Men</a>
            </div>
        </div>
    </div>
</section>

{{-- Categories --}}
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <h2 class="section-title text-center mb-10">Shop by Category</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a href="{{ route('category', 'men') }}" class="group relative rounded-2xl overflow-hidden bg-gray-200 block" style="aspect-ratio:4/5">
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div class="absolute bottom-6 left-6 text-white">
                <h3 class="font-display text-3xl font-bold">Men</h3>
                <span class="text-sm text-gray-300">Shop Men's Collection →</span>
            </div>
        </a>
        <a href="{{ route('category', 'women') }}" class="group relative rounded-2xl overflow-hidden bg-gray-200 block" style="aspect-ratio:4/5">
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div class="absolute bottom-6 left-6 text-white">
                <h3 class="font-display text-3xl font-bold">Women</h3>
                <span class="text-sm text-gray-300">Shop Women's Collection →</span>
            </div>
        </a>
        <a href="{{ route('category', 'kids') }}" class="group relative rounded-2xl overflow-hidden bg-gray-200 block" style="aspect-ratio:4/5">
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div class="absolute bottom-6 left-6 text-white">
                <h3 class="font-display text-3xl font-bold">Kids</h3>
                <span class="text-sm text-gray-300">Shop Kids' Collection →</span>
            </div>
        </a>
    </div>
</section>

{{-- New Arrivals --}}
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="flex items-center justify-between mb-8">
        <h2 class="section-title">New Arrivals</h2>
        <a href="{{ route('sale') }}" class="text-pink-600 font-medium hover:underline">View All →</a>
    </div>
    @if($newArrivals->count())
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        @foreach($newArrivals as $product)
        @include('components.product-card', ['product' => $product])
        @endforeach
    </div>
    @else
    <p class="text-gray-400 text-center py-12">No new arrivals yet. Check back soon!</p>
    @endif
</section>

{{-- Outfit Builder CTA --}}
<section class="bg-pink-50 py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="section-title mb-4">Build Your Perfect Outfit</h2>
        <p class="text-gray-600 text-lg mb-8 max-w-xl mx-auto">Mix and match tops, bottoms, shoes and accessories to create your signature look.</p>
        <a href="{{ route('outfit-builder') }}" class="btn-primary text-lg px-10 py-4">Try Outfit Builder ✨</a>
    </div>
</section>

{{-- Trending --}}
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="flex items-center justify-between mb-8">
        <h2 class="section-title">Trending Now</h2>
        <a href="{{ route('sale') }}" class="text-pink-600 font-medium hover:underline">View All →</a>
    </div>
    @if($trendingProducts->count())
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        @foreach($trendingProducts as $product)
        @include('components.product-card', ['product' => $product])
        @endforeach
    </div>
    @else
    <p class="text-gray-400 text-center py-12">No trending products yet.</p>
    @endif
</section>

{{-- Blog --}}
<section class="bg-gray-50 py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-8">
            <h2 class="section-title">Style Guides & Tips</h2>
            <a href="{{ route('blog.index') }}" class="text-pink-600 font-medium hover:underline">Read All →</a>
        </div>
        @if($blogs->count())
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            @foreach($blogs as $blog)
            <article class="card group">
                <a href="{{ route('blog.show', $blog->slug) }}">
                    <div class="aspect-video overflow-hidden bg-gray-100">
                        <img src="{{ $blog->cover_image ?? asset('images/placeholder.webp') }}" alt="{{ $blog->title }}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                    </div>
                    <div class="p-5">
                        <span class="inline-block bg-pink-100 text-pink-700 text-xs font-medium px-2.5 py-0.5 rounded-full mb-2">{{ $blog->category }}</span>
                        <h3 class="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-2">{{ $blog->title }}</h3>
                        <p class="text-sm text-gray-500 mt-2 line-clamp-2">{{ $blog->excerpt }}</p>
                        <p class="text-xs text-gray-400 mt-3">{{ $blog->published_at->format('M d, Y') }}</p>
                    </div>
                </a>
            </article>
            @endforeach
        </div>
        @else
        <p class="text-gray-400 text-center py-8">No blog posts yet.</p>
        @endif
    </div>
</section>

{{-- Trust Badges --}}
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div class="p-6">
            <div class="text-4xl mb-3">🚚</div>
            <h3 class="font-semibold text-gray-900">Free Shipping</h3>
            <p class="text-sm text-gray-500 mt-1">On orders above ₹999</p>
        </div>
        <div class="p-6">
            <div class="text-4xl mb-3">↩️</div>
            <h3 class="font-semibold text-gray-900">Easy Returns</h3>
            <p class="text-sm text-gray-500 mt-1">30-day hassle-free returns</p>
        </div>
        <div class="p-6">
            <div class="text-4xl mb-3">🔒</div>
            <h3 class="font-semibold text-gray-900">Secure Payment</h3>
            <p class="text-sm text-gray-500 mt-1">100% secure transactions</p>
        </div>
        <div class="p-6">
            <div class="text-4xl mb-3">⭐</div>
            <h3 class="font-semibold text-gray-900">Premium Quality</h3>
            <p class="text-sm text-gray-500 mt-1">Curated fashion brands</p>
        </div>
    </div>
</section>

@endsection
