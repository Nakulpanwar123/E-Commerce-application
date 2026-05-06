@extends('layouts.app')
@section('content')
<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex items-center justify-between mb-6">
        <h1 class="section-title">Order {{ $order->order_number }}</h1>
        <span class="badge {{ $order->status_badge }} capitalize text-sm px-3 py-1">{{ $order->status }}</span>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="card p-5">
            <h2 class="font-semibold mb-3">Delivery Address</h2>
            <p class="text-gray-700">{{ $order->shipping_name }}</p>
            <p class="text-gray-500 text-sm">{{ $order->shipping_line1 }}, {{ $order->shipping_city }}, {{ $order->shipping_state }} - {{ $order->shipping_pincode }}</p>
            <p class="text-gray-500 text-sm">📞 {{ $order->shipping_phone }}</p>
        </div>
        <div class="card p-5">
            <h2 class="font-semibold mb-3">Payment</h2>
            <p class="text-gray-700 capitalize">{{ $order->payment_method }}</p>
            <p class="text-sm {{ $order->payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600' }} capitalize">{{ $order->payment_status }}</p>
        </div>
    </div>
    <div class="card overflow-hidden mb-6">
        <table class="w-full text-sm">
            <thead class="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                    <th class="px-5 py-3 text-left">Product</th>
                    <th class="px-5 py-3 text-left">Qty</th>
                    <th class="px-5 py-3 text-left">Price</th>
                    <th class="px-5 py-3 text-left">Total</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
                @foreach($order->items as $item)
                <tr>
                    <td class="px-5 py-4">
                        <div class="flex items-center gap-3">
                            <img src="{{ $item->product?->primary_image }}" alt="" class="w-12 h-12 object-cover rounded-lg">
                            <div>
                                <p class="font-medium text-gray-900">{{ $item->product_name }}</p>
                                @if($item->variant_name)<p class="text-xs text-gray-400">{{ $item->variant_name }}</p>@endif
                            </div>
                        </div>
                    </td>
                    <td class="px-5 py-4">{{ $item->quantity }}</td>
                    <td class="px-5 py-4">₹{{ number_format($item->price) }}</td>
                    <td class="px-5 py-4 font-semibold">₹{{ number_format($item->total) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    <div class="flex justify-end">
        <div class="w-64 space-y-2 text-sm">
            <div class="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{{ number_format($order->subtotal) }}</span></div>
            <div class="flex justify-between text-gray-600"><span>Shipping</span><span>{{ $order->shipping == 0 ? 'FREE' : '₹'.$order->shipping }}</span></div>
            <div class="flex justify-between text-gray-600"><span>Tax</span><span>₹{{ number_format($order->tax) }}</span></div>
            <div class="flex justify-between font-bold text-gray-900 border-t pt-2"><span>Total</span><span>₹{{ number_format($order->total) }}</span></div>
        </div>
    </div>
    <div class="mt-6 flex gap-3">
        <a href="{{ route('dashboard.invoice', $order) }}" class="btn-primary">Download Invoice</a>
        <a href="{{ route('dashboard.orders') }}" class="btn-ghost">← Back to Orders</a>
    </div>
</div>
@endsection
