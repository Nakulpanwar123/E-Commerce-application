@extends('layouts.app')
@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="section-title mb-8">My Account</h1>
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {{-- Sidebar --}}
        <aside class="lg:col-span-1">
            <nav class="card p-4 space-y-1">
                @foreach([
                    [route('dashboard'),'My Orders','M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'],
                    [route('wishlist'),'Wishlist','M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'],
                    [route('profile'),'Profile','M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'],
                ] as [$url,$label,$path])
                <a href="{{ $url }}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="{{ $path }}"/></svg>
                    {{ $label }}
                </a>
                @endforeach
            </nav>
        </aside>
        {{-- Content --}}
        <div class="lg:col-span-3">
            <div class="card p-6 mb-6">
                <h2 class="font-semibold text-lg mb-1">Welcome back, {{ $user->name }}! 👋</h2>
                <p class="text-gray-500 text-sm">{{ $user->email }}</p>
            </div>
            <h2 class="font-semibold text-gray-900 mb-4">Recent Orders</h2>
            @forelse($recentOrders as $order)
            <div class="card p-4 mb-3 flex items-center justify-between">
                <div>
                    <p class="font-medium text-gray-900">{{ $order->order_number }}</p>
                    <p class="text-sm text-gray-500">{{ $order->created_at->format('M d, Y') }} · {{ $order->items->count() }} items</p>
                </div>
                <div class="flex items-center gap-4">
                    <span class="badge {{ $order->status_badge }} capitalize">{{ $order->status }}</span>
                    <span class="font-bold">₹{{ number_format($order->total) }}</span>
                    <a href="{{ route('dashboard.order.detail', $order) }}" class="text-primary-600 text-sm hover:underline">View</a>
                </div>
            </div>
            @empty
            <p class="text-gray-400 text-center py-8">No orders yet. <a href="{{ route('home') }}" class="text-primary-600 hover:underline">Start shopping!</a></p>
            @endforelse
        </div>
    </div>
</div>
@endsection
