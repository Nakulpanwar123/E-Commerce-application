@extends('layouts.app')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="section-title mb-8">Your Cart</h1>

    @if($cartItems->isEmpty())
    <div class="text-center py-20">
        <svg class="w-20 h-20 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 7H4l1-7z"/></svg>
        <p class="text-gray-400 text-lg mb-6">Your cart is empty</p>
        <a href="{{ route('category', 'women') }}" class="btn-primary">Start Shopping</a>
    </div>
    @else
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {{-- Cart Items --}}
        <div class="lg:col-span-2 space-y-4">
            @foreach($cartItems as $item)
            <div class="card p-4 flex gap-4" x-data="{ qty: {{ $item->quantity }} }">
                <a href="{{ route('product.show', $item->product->slug) }}" class="flex-shrink-0">
                    <img src="{{ $item->product->primary_image }}" alt="{{ $item->product->name }}"
                        class="w-24 h-32 object-cover rounded-xl" width="96" height="128">
                </a>
                <div class="flex-1 min-w-0">
                    <div class="flex justify-between">
                        <div>
                            <p class="text-xs text-gray-400">{{ $item->product->brand }}</p>
                            <a href="{{ route('product.show', $item->product->slug) }}" class="font-semibold text-gray-900 hover:text-primary-600">{{ $item->product->name }}</a>
                            <p class="text-sm text-gray-500 mt-1">
                                @if($item->variant) Size: {{ $item->variant->size }} | Color: {{ $item->variant->color }} @endif
                            </p>
                        </div>
                        <button
                            class="text-gray-400 hover:text-red-500 transition-colors"
                            @click="axios.delete('/cart/{{ $item->id }}').then(r => { $store.cart.count = r.data.cart_count; $el.closest('[x-data]').remove(); })"
                            aria-label="Remove item"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>
                    <div class="flex items-center justify-between mt-4">
                        <div class="flex items-center border border-gray-200 rounded-lg">
                            <button class="px-3 py-1 text-gray-600 hover:text-primary-600"
                                @click="qty = Math.max(1, qty-1); axios.patch('/cart/{{ $item->id }}', {quantity: qty})">−</button>
                            <span class="px-3 py-1 font-medium" x-text="qty"></span>
                            <button class="px-3 py-1 text-gray-600 hover:text-primary-600"
                                @click="qty = Math.min(10, qty+1); axios.patch('/cart/{{ $item->id }}', {quantity: qty})">+</button>
                        </div>
                        <span class="font-bold text-gray-900">₹{{ number_format($item->product->sale_price * $item->quantity) }}</span>
                    </div>
                </div>
            </div>
            @endforeach
        </div>

        {{-- Order Summary --}}
        <div class="lg:col-span-1">
            <div class="card p-6 sticky top-24">
                <h2 class="font-semibold text-lg text-gray-900 mb-4">Order Summary</h2>

                {{-- Coupon --}}
                <form action="{{ route('coupon.apply') }}" method="POST" class="flex gap-2 mb-6">
                    @csrf
                    <input type="text" name="code" placeholder="Coupon code" value="{{ session('coupon_code') }}"
                        class="input-field text-sm py-2 flex-1">
                    <button type="submit" class="btn-outline text-sm py-2 px-4">Apply</button>
                </form>
                @if(session('coupon_error'))
                <p class="text-red-500 text-xs -mt-4 mb-4">{{ session('coupon_error') }}</p>
                @endif

                <div class="space-y-3 text-sm">
                    <div class="flex justify-between text-gray-600">
                        <span>Subtotal ({{ $cartItems->sum('quantity') }} items)</span>
                        <span>₹{{ number_format($subtotal) }}</span>
                    </div>
                    @if($discount > 0)
                    <div class="flex justify-between text-green-600">
                        <span>Discount ({{ session('coupon_code') }})</span>
                        <span>-₹{{ number_format($discount) }}</span>
                    </div>
                    @endif
                    <div class="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span>{{ $shipping === 0 ? 'FREE' : '₹'.number_format($shipping) }}</span>
                    </div>
                    <div class="flex justify-between text-gray-600">
                        <span>GST (18%)</span>
                        <span>₹{{ number_format($tax) }}</span>
                    </div>
                    <div class="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                        <span>Total</span>
                        <span>₹{{ number_format($total) }}</span>
                    </div>
                </div>

                <a href="{{ route('checkout') }}" class="btn-primary w-full text-center mt-6 block">
                    Proceed to Checkout
                </a>
                <a href="{{ route('category', 'women') }}" class="btn-ghost w-full text-center mt-2 block text-sm">
                    Continue Shopping
                </a>
            </div>
        </div>
    </div>
    @endif
</div>
@endsection
