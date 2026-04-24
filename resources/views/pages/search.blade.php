@extends('layouts.app')
@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="section-title mb-2">Search Results</h1>
    <p class="text-gray-500 mb-8">{{ $products->total() }} results for "<strong>{{ $q }}</strong>"</p>
    @if($products->isEmpty())
    <div class="text-center py-16">
        <p class="text-gray-400 text-lg">No products found. Try a different search term.</p>
    </div>
    @else
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        @foreach($products as $product)
            @include('components.product-card', compact('product'))
        @endforeach
    </div>
    <div class="mt-8">{{ $products->appends(['q' => $q])->links() }}</div>
    @endif
</div>
@endsection
