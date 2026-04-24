@extends('layouts.app')
@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
    <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
    </div>
    <h1 class="section-title mb-3">Order Placed Successfully!</h1>
    <p class="text-gray-500 mb-2">Your order <strong>{{ $orderNumber }}</strong> has been confirmed.</p>
    <p class="text-gray-400 text-sm mb-8">You will receive a confirmation email shortly.</p>
    <div class="flex justify-center gap-4">
        <a href="{{ route('dashboard.orders') }}" class="btn-primary">Track My Order</a>
        <a href="{{ route('home') }}" class="btn-outline">Continue Shopping</a>
    </div>
</div>
@endsection
