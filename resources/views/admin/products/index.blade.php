@extends('layouts.admin')
@section('title', 'Products')

@section('content')
<div class="flex items-center justify-between mb-6">
    <div class="flex gap-3">
        <form method="GET" class="flex gap-2">
            <input type="search" name="search" value="{{ request('search') }}" placeholder="Search products..." class="input-field text-sm py-2 w-64">
            <select name="category" class="input-field text-sm py-2 w-40">
                <option value="">All Categories</option>
                @foreach($categories as $cat)
                <option value="{{ $cat->id }}" {{ request('category') == $cat->id ? 'selected' : '' }}>{{ $cat->name }}</option>
                @endforeach
            </select>
            <button type="submit" class="btn-primary text-sm py-2 px-4">Filter</button>
        </form>
    </div>
    <div class="flex gap-3">
        <form action="{{ route('admin.products.bulk-upload') }}" method="POST" enctype="multipart/form-data" class="flex gap-2">
            @csrf
            <input type="file" name="csv" accept=".csv" class="text-sm text-gray-600 file:btn-outline file:text-sm file:py-1 file:px-3 file:mr-2">
            <button type="submit" class="btn-outline text-sm py-2 px-4">Import CSV</button>
        </form>
        <a href="{{ route('admin.products.create') }}" class="btn-primary text-sm py-2 px-4">+ Add Product</a>
    </div>
</div>

<div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <table class="w-full text-sm">
        <thead class="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
                @foreach(['Product','Category','Price','Stock','Status','Actions'] as $h)
                <th class="px-6 py-3 text-left font-medium">{{ $h }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
            @foreach($products as $product)
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                        <img src="{{ $product->primary_image }}" alt="" class="w-10 h-10 object-cover rounded-lg">
                        <div>
                            <p class="font-medium text-gray-900">{{ $product->name }}</p>
                            <p class="text-xs text-gray-400">{{ $product->sku }}</p>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 text-gray-600">{{ $product->category->name }}</td>
                <td class="px-6 py-4">
                    <span class="font-semibold">₹{{ number_format($product->sale_price) }}</span>
                    @if($product->discount_percent)
                    <span class="text-xs text-red-500 ml-1">-{{ $product->discount_percent }}%</span>
                    @endif
                </td>
                <td class="px-6 py-4">
                    <span class="{{ $product->stock <= 5 ? 'text-red-600 font-semibold' : 'text-gray-700' }}">{{ $product->stock }}</span>
                </td>
                <td class="px-6 py-4">
                    <span class="badge {{ $product->is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500' }}">
                        {{ $product->is_active ? 'Active' : 'Inactive' }}
                    </span>
                </td>
                <td class="px-6 py-4">
                    <div class="flex gap-2">
                        <a href="{{ route('admin.products.edit', $product) }}" class="text-primary-600 hover:underline text-xs">Edit</a>
                        <form method="POST" action="{{ route('admin.products.destroy', $product) }}" onsubmit="return confirm('Delete this product?')">
                            @csrf @method('DELETE')
                            <button type="submit" class="text-red-500 hover:underline text-xs">Delete</button>
                        </form>
                    </div>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
    <div class="p-4 border-t border-gray-100">{{ $products->withQueryString()->links() }}</div>
</div>
@endsection
