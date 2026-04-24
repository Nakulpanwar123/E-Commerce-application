@extends('layouts.admin')
@section('title', 'Dashboard')

@section('content')

{{-- Stats Grid --}}
<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    @foreach([
        ['Today\'s Revenue', '₹'.number_format($stats['revenue_today']), 'text-green-600', 'bg-green-50', 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'],
        ['Monthly Revenue', '₹'.number_format($stats['revenue_month']), 'text-blue-600', 'bg-blue-50', 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'],
        ['Pending Orders', $stats['orders_pending'], 'text-yellow-600', 'bg-yellow-50', 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'],
        ['Total Customers', number_format($stats['total_customers']), 'text-purple-600', 'bg-purple-50', 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'],
    ] as [$label,$value,$color,$bg,$path])
    <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-3">
            <p class="text-sm text-gray-500">{{ $label }}</p>
            <div class="w-9 h-9 {{ $bg }} rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 {{ $color }}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="{{ $path }}"/></svg>
            </div>
        </div>
        <p class="text-2xl font-bold text-gray-900">{{ $value }}</p>
    </div>
    @endforeach
</div>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

    {{-- Revenue Chart --}}
    <div class="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 class="font-semibold text-gray-900 mb-4">Revenue (Last 30 Days)</h2>
        <canvas id="revenueChart" height="100"></canvas>
    </div>

    {{-- Top Products --}}
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 class="font-semibold text-gray-900 mb-4">Top Products</h2>
        <div class="space-y-3">
            @foreach($topProducts as $item)
            <div class="flex items-center gap-3">
                <img src="{{ $item->product?->primary_image }}" alt="" class="w-10 h-10 object-cover rounded-lg">
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ $item->product?->name }}</p>
                    <p class="text-xs text-gray-500">{{ $item->sold }} sold</p>
                </div>
                <span class="text-sm font-semibold text-gray-900">₹{{ number_format($item->revenue) }}</span>
            </div>
            @endforeach
        </div>
    </div>
</div>

{{-- Recent Orders --}}
<div class="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="p-6 border-b border-gray-100 flex items-center justify-between">
        <h2 class="font-semibold text-gray-900">Recent Orders</h2>
        <a href="{{ route('admin.orders.index') }}" class="text-sm text-primary-600 hover:underline">View All</a>
    </div>
    <div class="overflow-x-auto">
        <table class="w-full text-sm">
            <thead class="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                    @foreach(['Order','Customer','Amount','Status','Date'] as $h)
                    <th class="px-6 py-3 text-left font-medium">{{ $h }}</th>
                    @endforeach
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
                @foreach($recentOrders as $order)
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 font-medium text-primary-600">
                        <a href="{{ route('admin.orders.show', $order) }}">{{ $order->order_number }}</a>
                    </td>
                    <td class="px-6 py-4 text-gray-700">{{ $order->user->name }}</td>
                    <td class="px-6 py-4 font-semibold">₹{{ number_format($order->total) }}</td>
                    <td class="px-6 py-4">
                        <span class="badge {{ $order->status_badge }} capitalize">{{ $order->status }}</span>
                    </td>
                    <td class="px-6 py-4 text-gray-500">{{ $order->created_at->format('M d, Y') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>

@push('scripts')
<script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js"></script>
<script>
new Chart(document.getElementById('revenueChart'), {
    type: 'line',
    data: {
        labels: @json($revenueChart->pluck('date')),
        datasets: [{
            label: 'Revenue (₹)',
            data: @json($revenueChart->pluck('revenue')),
            borderColor: '#db2777',
            backgroundColor: 'rgba(219,39,119,0.08)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 3,
        }]
    },
    options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { callback: v => '₹' + v.toLocaleString() } } }
    }
});
</script>
@endpush
@endsection
