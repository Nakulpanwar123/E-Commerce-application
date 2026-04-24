@extends('layouts.app')
@section('content')
<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="section-title mb-8">My Orders</h1>
    @forelse($orders as $order)
    <div class="card p-5 mb-4">
        <div class="flex items-center justify-between mb-3">
            <div>
                <p class="font-semibold text-gray-900">{{ $order->order_number }}</p>
                <p class="text-sm text-gray-500">{{ $order->created_at->format('M d, Y') }}</p>
            </div>
            <div class="flex items-center gap-3">
                <span class="badge {{ $order->status_badge }} capitalize">{{ $order->status }}</span>
                <span class="font-bold text-gray-900">₹{{ number_format($order->total) }}</span>
            </div>
        </div>
        <div class="flex gap-3">
            <a href="{{ route('dashboard.order.detail', $order) }}" class="btn-outline text-sm py-1.5 px-4">View Details</a>
            <a href="{{ route('dashboard.invoice', $order) }}" class="btn-ghost text-sm py-1.5 px-4">Download Invoice</a>
        </div>
    </div>
    @empty
    <p class="text-center text-gray-400 py-12">No orders found.</p>
    @endforelse
    <div class="mt-6">{{ $orders->links() }}</div>
</div>
@endsection
