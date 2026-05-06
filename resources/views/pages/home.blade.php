@extends('layouts.app')

@push('schema')
@verbatim
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
@endverbatim
@endpush

@section('content')

{{-- Hero Section --}}
<section class="relative bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white overflow-hidden min-h-[85vh] flex items-center">
    <div class="absolute inset-0 opacity-30">
        <img data-src="{{ asset('images/hero-bg.webp') }}" alt="" class="w-full h-full object-cover skeleton" aria-hidden="true">
    </div>
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="max-w-2xl animate-slide-up">
            <span class="badge bg-primary-500/20 text-primary-300 border border-primary-500/30 mb-4">New Collection 2025</span>
            <h1 class="font-display text-5xl md:text-7xl font-bold leading-tight text-balance">
                Dress Your <span class="text-primary-400">Story</span>
            </h1>
            <p class="mt-6 text-xl text-gray-300 leading-relaxed">
                Discover premium fashion curated for every occasion. From casual to couture — find your perfect look.
            </p>
            <div class="flex flex-wrap gap-4 mt-8">
                <a href="{{ route('category', 'women') }}" class="btn-primary text-lg px-8 py-4">Shop Women</a>
                <a href="{{ route('category', 'men') }}" class="btn-outline border-white text-white hover:bg-white hover:text-gray-900 text-lg px-8 py-4">Shop Men</a>
            </div>
        </div>
    </div>
</section>

{{-- Category Cards --}}
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <h2 class="section-title text-center mb-10">Shop by Category</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        @foreach([
            ['Men','men','men-category.webp','Shop Men\'s Collection'],
            ['Women','women','women-category.webp','Shop Women\'s Collection'],
            ['Kids','kids','kids-category.webp','Shop Kids\' Collection'],
        ] as [$label,$slug,$img,$cta])
        <a href="{{ route('category', $slug) }}" class="group relative rounded-2xl overflow-hidden aspect-[4/5] block">
            <img data-src="{{ asset('images/categories/'.$img) }}" alt="{{ $label }} Fashion" class="w-full h-full object-cover skeleton group-hover:scale-105 transition-transform duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div class="absolute bottom-6 left-6 text-white">
                <h3 class="font-display text-3xl font-bold">{{ $label }}</h3>
                <span class="text-sm text-gray-300 group-hover:text-primary-300 transition-colors">{{ $cta }} →</span>
            </div>
        </a>
        @endforeach
    </div>
</section>

{{-- Flash Sale --}}
@if($flashSale)
<section class="bg-gray-900 text-white py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div>
                <span class="badge bg-red-500 text-white mb-2">⚡ Flash Sale</span>
                <h2 class="section-title text-white">{{ $flashSale->name }}</h2>
            </div>
            <div x-data="countdown('{{ $flashSale->ends_at->toISOString() }}')" class="flex items-center gap-3">
                <span class="text-gray-400 text-sm">Ends in:</span>
                <div class="flex gap-2">
                    <div class="text-center"><div class="countdown-digit" x-text="hours"></div><div class="text-xs text-gray-400 mt-1">HRS</div></div>
                    <div class="countdown-digit self-start mt-1">:</div>
                    <div class="text-center"><div class="countdown-digit" x-text="minutes"></div><div class="text-xs text-gray-400 mt-1">MIN</div></div>
                    <div class="countdown-digit self-start mt-1">:</div>
                    <div class="text-center"><div class="countdown-digit" x-text="seconds"></div><div class="text-xs text-gray-400 mt-1">SEC</div></div>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            @foreach($flashSaleProducts as $product)
                @include('components.product-card', ['product' => $product, 'dark' => true])
            @endforeach
        </div>
    </div>
</section>
@endif

{{-- New Arrivals --}}
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="flex items-center justify-between mb-8">
        <h2 class="section-title">New Arrivals</h2>
        <a href="{{ route('category', 'new-arrivals') }}" class="text-primary-600 font-medium hover:underline">View All →</a>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        @foreach($newArrivals as $product)
            @include('components.product-card', compact('product'))
        @endforeach
    </div>
</section>

{{-- Outfit Builder CTA --}}
<section class="bg-primary-50 py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="section-title mb-4">Build Your Perfect Outfit</h2>
        <p class="text-gray-600 text-lg mb-8 max-w-xl mx-auto">Mix and match tops, bottoms, shoes and accessories to create your signature look.</p>
        <a href="{{ route('outfit-builder') }}" class="btn-primary text-lg px-10 py-4">Try Outfit Builder ✨</a>
    </div>
</section>

{{-- Trending Products --}}
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="flex items-center justify-between mb-8">
        <h2 class="section-title">Trending Now</h2>
        <a href="{{ route('category', 'trending') }}" class="text-primary-600 font-medium hover:underline">View All →</a>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        @foreach($trendingProducts as $product)
            @include('components.product-card', compact('product'))
        @endforeach
    </div>
</section>

{{-- Blog Preview --}}
<section class="bg-gray-50 py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-8">
            <h2 class="section-title">Style Guides & Tips</h2>
            <a href="{{ route('blog.index') }}" class="text-primary-600 font-medium hover:underline">Read All →</a>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            @foreach($blogs as $blog)
            <article class="card group">
                <a href="{{ route('blog.show', $blog->slug) }}">
                    <div class="aspect-video overflow-hidden">
                        <img data-src="{{ $blog->cover_image }}" alt="{{ $blog->title }}" class="w-full h-full object-cover skeleton group-hover:scale-105 transition-transform duration-300">
                    </div>
                    <div class="p-5">
                        <span class="badge bg-primary-100 text-primary-700 mb-2">{{ $blog->category }}</span>
                        <h3 class="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">{{ $blog->title }}</h3>
                        <p class="text-sm text-gray-500 mt-2 line-clamp-2">{{ $blog->excerpt }}</p>
                        <p class="text-xs text-gray-400 mt-3">{{ $blog->published_at->format('M d, Y') }}</p>
                    </div>
                </a>
            </article>
            @endforeach
        </div>
    </div>
</section>

{{-- Trust Badges --}}
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        @foreach([
            ['🚚','Free Shipping','On orders above ₹999'],
            ['↩️','Easy Returns','30-day hassle-free returns'],
            ['🔒','Secure Payment','100% secure transactions'],
            ['⭐','Premium Quality','Curated fashion brands'],
        ] as [$icon,$title,$desc])
        <div class="p-6">
            <div class="text-4xl mb-3">{{ $icon }}</div>
            <h3 class="font-semibold text-gray-900">{{ $title }}</h3>
            <p class="text-sm text-gray-500 mt-1">{{ $desc }}</p>
        </div>
        @endforeach
    </div>
</section>

@endsection
