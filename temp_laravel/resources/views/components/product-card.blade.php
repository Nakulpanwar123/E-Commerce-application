<article class="product-card" x-data="{ wishlisted: false }">
    <div class="relative overflow-hidden bg-gray-100" style="aspect-ratio:3/4">
        <a href="{{ route('product.show', $product->slug) }}">
            <img
                src="{{ $product->primary_image }}"
                alt="{{ $product->name }}"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                width="300" height="400"
            >
            @if($product->discount_percent)
            <span class="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">-{{ $product->discount_percent }}%</span>
            @endif
            @if($product->is_new)
            <span class="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">New</span>
            @endif
        </a>

        <button
            class="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:scale-110 transition-transform"
            @click="$store.wishlist.toggle({{ $product->id }}); wishlisted = !wishlisted"
            aria-label="Add to wishlist"
        >
            <svg class="w-4 h-4 transition-colors" :class="wishlisted ? 'text-red-500 fill-current' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
        </button>

        <div class="absolute bottom-0 left-0 right-0 bg-white/95 py-3 px-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
                class="w-full btn-primary text-sm py-2"
                @click="$store.cart.add({{ $product->id }}, null)"
            >Quick Add</button>
        </div>
    </div>

    <div class="p-4">
        <a href="{{ route('product.show', $product->slug) }}">
            <p class="text-xs text-gray-400 mb-1">{{ $product->brand }}</p>
            <h3 class="font-medium text-gray-900 line-clamp-1 group-hover:text-pink-600 transition-colors">{{ $product->name }}</h3>
        </a>
        <div class="flex items-center justify-between mt-2">
            <div class="flex items-center gap-2">
                <span class="font-bold text-gray-900">₹{{ number_format($product->sale_price) }}</span>
                @if($product->original_price > $product->sale_price)
                <span class="text-sm text-gray-400 line-through">₹{{ number_format($product->original_price) }}</span>
                @endif
            </div>
            @if($product->avg_rating)
            <div class="flex items-center gap-1 text-xs text-gray-500">
                <svg class="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                {{ number_format($product->avg_rating, 1) }}
            </div>
            @endif
        </div>
    </div>
</article>
