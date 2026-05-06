@extends('layouts.admin')
@section('title', 'Orders')
@section('content')
<div class="flex items-center gap-3 mb-6">
    <form method="GET" class="flex gap-2">
        <input type="search" name="search" value="{{ request('search') }}" placeholder="Search order number..." class="input-field text-sm py-2 w-64">
        <select name="status" class="input-field text-sm py-2 w-40">
            <option value="">All Status</option>
            @foreach(['pending','confirmed','processing','shipped','delivered','cancelled','refunded'] as $s)
            <option value="{{ $s }}" {{ request('status') === $s ? 'selected' : '' }} class="capitalize">{{ ucfirst($s) }}</option>
            @endforeach
        </select>
        <button type="submit" class="btn-primary text-sm py-2 px-4">Filter</button>
    </form>
</div>
<div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <table class="w-full text-sm">
        <thead class="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>@foreach(['Order','Customer','Total','Status','Payment','Date','Action'] as $h)<th class="px-6 py-3 text-left font-medium">{{ $h }}</th>@endforeach</tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
            @foreach($orders as $order)
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 font-medium text-primary-600"><a href="{{ route('admin.orders.show', $order) }}">{{ $order->order_number }}</a></td>
                <td class="px-6 py-4 text-gray-700">{{ $order->user->name }}</td>
                <td class="px-6 py-4 font-semibold">₹{{ number_format($order->total) }}</td>
                <td class="px-6 py-4"><span class="badge {{ $order->status_badge }} capitalize">{{ $order->status }}</span></td>
                <td class="px-6 py-4 capitalize text-gray-600">{{ $order->payment_status }}</td>
                <td class="px-6 py-4 text-gray-500">{{ $order->created_at->format('M d, Y') }}</td>
                <td class="px-6 py-4"><a href="{{ route('admin.orders.show', $order) }}" class="text-primary-600 hover:underline text-xs">View</a></td>
            </tr>
            @endforeach
        </tbody>
    </table>
    <div class="p-4 border-t border-gray-100">{{ $orders->withQueryString()->links() }}</div>
</div>
@endsection
