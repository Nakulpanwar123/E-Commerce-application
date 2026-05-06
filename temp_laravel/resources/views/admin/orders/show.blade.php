@extends('layouts.admin')
@section('title', 'Order ' . $order->order_number)
@section('content')
<div class="max-w-4xl">
    <div class="flex items-center justify-between mb-6">
        <div>
            <p class="text-sm text-gray-500">Order</p>
            <h2 class="text-xl font-bold text-gray-900">{{ $order->order_number }}</h2>
        </div>
        <form method="POST" action="{{ route('admin.orders.status', $order) }}" class="flex gap-2">
            @csrf @method('PATCH')
            <select name="status" class="input-field text-sm py-2">
                @foreach(\App\Models\Order::STATUSES as $s)
                <option value="{{ $s }}" {{ $order->status === $s ? 'selected' : '' }} class="capitalize">{{ ucfirst($s) }}</option>
                @endforeach
            </select>
            <input type="text" name="tracking_number" value="{{ $order->tracking_number }}" placeholder="Tracking #" class="input-field text-sm py-2 w-40">
            <button type="submit" class="btn-primary text-sm py-2 px-4">Update</button>
        </form>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="card p-4">
            <h3 class="font-semibold mb-2">Customer</h3>
            <p class="text-gray-700">{{ $order->user->name }}</p>
            <p class="text-gray-500 text-sm">{{ $order->user->email }}</p>
        </div>
        <div class="card p-4">
            <h3 class="font-semibold mb-2">Shipping Address</h3>
            <p class="text-gray-700">{{ $order->shipping_name }}</p>
            <p class="text-gray-500 text-sm">{{ $order->shipping_line1 }}, {{ $order->shipping_city }}, {{ $order->shipping_state }} - {{ $order->shipping_pincode }}</p>
        </div>
    </div>

    <div class="card overflow-hidden mb-4">
        <table class="w-full text-sm">
            <thead class="bg-gray-50 text-xs uppercase text-gray-500">
                <tr><th class="px-5 py-3 text-left">Product</th><th class="px-5 py-3 text-left">Qty</th><th class="px-5 py-3 text-left">Price</th><th class="px-5 py-3 text-left">Total</th></tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
                @foreach($order->items as $item)
                <tr>
                    <td class="px-5 py-3">{{ $item->product_name }}</td>
                    <td class="px-5 py-3">{{ $item->quantity }}</td>
                    <td class="px-5 py-3">₹{{ number_format($item->price) }}</td>
                    <td class="px-5 py-3 font-semibold">₹{{ number_format($item->total) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="flex justify-end">
        <div class="w-56 space-y-2 text-sm">
            <div class="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{{ number_format($order->subtotal) }}</span></div>
            <div class="flex justify-between text-gray-600"><span>Shipping</span><span>{{ $order->shipping == 0 ? 'FREE' : '₹'.$order->shipping }}</span></div>
            <div class="flex justify-between text-gray-600"><span>Tax</span><span>₹{{ number_format($order->tax) }}</span></div>
            <div class="flex justify-between font-bold text-gray-900 border-t pt-2"><span>Total</span><span>₹{{ number_format($order->total) }}</span></div>
        </div>
    </div>
</div>
@endsection
