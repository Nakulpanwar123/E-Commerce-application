@extends('layouts.app')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

    {{-- Breadcrumb --}}
    <nav class="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <a href="{{ route('home') }}" class="hover:text-primary-600">Home</a>
        @foreach($breadcrumbs as $crumb)
        <span>/</span>
        @if($loop->last)
        <span class="text-gray-900 font-medium">{{ $crumb['name'] }}</span>
        @else
        <a href="{{ $crumb['url'] }}" class="hover:text-primary-600">{{ $crumb['name'] }}</a>
        @endif
        @endforeach
    </nav>

    <div class="flex flex-col lg:flex-row gap-8">

        {{-- Filters Sidebar --}}
        <aside class="lg:w-64 flex-shrink-0" x-data="{ open: false }">
            <button class="lg:hidden w-full btn-outline mb-4" @click="open = !open">
                Filters <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/></svg>
            </button>

            <div class="hidden lg:block space-y-6" :class="open ? '!block' : ''">
                <form method="GET" id="filter-form">
                    {{-- Price Range --}}
                    <div class="card p-4">
                        <h3 class="font-semibold text-gray-900 mb-4">Price Range</h3>
                        <div class="flex gap-2">
                            <input type="number" name="min_price" value="{{ request('min_price') }}" placeholder="Min" class="input-field text-sm py-2">
                            <input type="number" name="max_price" value="{{ request('max_price') }}" placeholder="Max" class="input-field text-sm py-2">
                        </div>
                    </div>

                    {{-- Sizes --}}
                    <div class="card p-4">
                        <h3 class="font-semibold text-gray-900 mb-4">Size</h3>
                        <div class="flex flex-wrap gap-2">
                            @foreach(['XS','S','M','L','XL','XXL'] as $size)
                            <label class="cursor-pointer">
                                <input type="checkbox" name="sizes[]" value="{{ $size }}" class="sr-only peer" {{ in_array($size, request('sizes', [])) ? 'checked' : '' }}>
                                <span class="px-3 py-1 border-2 rounded-lg text-sm font-medium peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:text-primary-700 border-gray-200 hover:border-gray-400 transition-colors">{{ $size }}</span>
                            </label>
                            @endforeach
                        </div>
                    </div>

                    {{-- Colors --}}
                    <div class="card p-4">
                        <h3 class="font-semibold text-gray-900 mb-4">Color</h3>
                        <div class="flex flex-wrap gap-2">
                            @foreach($availableColors as $color)
                            <label class="cursor-pointer" title="{{ $color->name }}">
                                <input type="checkbox" name="colors[]" value="{{ $color->slug }}" class="sr-only peer" {{ in_array($color->slug, request('colors', [])) ? 'checked' : '' }}>
                                <span class="w-7 h-7 rounded-full border-2 block peer-checked:border-primary-500 peer-checked:scale-110 border-gray-200 transition-all" style="background-color:{{ $color->hex }}"></span>
                            </label>
                            @endforeach
                        </div>
                    </div>

                    {{-- Brands --}}
                    <div class="card p-4">
                        <h3 class="font-semibold text-gray-900 mb-4">Brand</h3>
                        <div class="space-y-2 max-h-48 overflow-y-auto">
                            @foreach($availableBrands as $brand)
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="brands[]" value="{{ $brand }}" class="rounded text-primary-600" {{ in_array($brand, request('brands', [])) ? 'checked' : '' }}>
                                <span class="text-sm text-gray-700">{{ $brand }}</span>
                            </label>
                            @endforeach
                        </div>
                    </div>

                    <button type="submit" class="w-full btn-primary">Apply Filters</button>
                    <a href="{{ url()->current() }}" class="w-full btn-ghost text-center block mt-2">Clear All</a>
                </form>
            </div>
        </aside>

        {{-- Products Grid --}}
        <div class="flex-1">
            <div class="flex items-center justify-between mb-6">
                <h1 class="section-title">{{ $category->name }}</h1>
                <div class="flex items-center gap-3">
                    <span class="text-sm text-gray-500">{{ $products->total() }} products</span>
                    <select name="sort" form="filter-form" onchange="document.getElementById('filter-form').submit()"
                        class="input-field text-sm py-2 w-auto">
                        <option value="newest" {{ request('sort') === 'newest' ? 'selected' : '' }}>Newest</option>
                        <option value="price_asc" {{ request('sort') === 'price_asc' ? 'selected' : '' }}>Price: Low to High</option>
                        <option value="price_desc" {{ request('sort') === 'price_desc' ? 'selected' : '' }}>Price: High to Low</option>
                        <option value="popular" {{ request('sort') === 'popular' ? 'selected' : '' }}>Most Popular</option>
                        <option value="rating" {{ request('sort') === 'rating' ? 'selected' : '' }}>Top Rated</option>
                    </select>
                </div>
            </div>

            @if($products->isEmpty())
            <div class="text-center py-20">
                <p class="text-gray-400 text-lg">No products found. Try adjusting your filters.</p>
                <a href="{{ url()->current() }}" class="btn-primary mt-4 inline-block">Clear Filters</a>
            </div>
            @else
            <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                @foreach($products as $product)
                    @include('components.product-card', compact('product'))
                @endforeach
            </div>
            <div class="mt-10">{{ $products->withQueryString()->links() }}</div>
            @endif
        </div>
    </div>
</div>
@endsection
