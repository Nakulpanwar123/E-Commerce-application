@extends('layouts.app')
@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="section-title mb-8">My Wishlist</h1>
    @if($items->isEmpty())
    <div class="text-center py-20">
        <svg class="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
        <p class="text-gray-400 text-lg mb-4">Your wishlist is empty</p>
        <a href="{{ route('home') }}" class="btn-primary">Discover Products</a>
    </div>
    @else
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        @foreach($items as $item)
            @include('components.product-card', ['product' => $item->product])
        @endforeach
    </div>
    @endif
</div>
@endsection
