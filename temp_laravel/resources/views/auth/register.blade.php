@extends('layouts.app')
@section('content')
<div class="min-h-screen flex items-center justify-center py-12 px-4">
    <div class="w-full max-w-md">
        <div class="text-center mb-8">
            <a href="{{ route('home') }}" class="font-display text-3xl font-bold text-primary-600">FashionStore</a>
            <h1 class="text-2xl font-bold text-gray-900 mt-4">Create account</h1>
            <p class="text-gray-500 mt-1">Join thousands of fashion lovers</p>
        </div>
        <div class="card p-8">
            @if($errors->any())
            <div class="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">{{ $errors->first() }}</div>
            @endif
            <form method="POST" action="{{ route('register.post') }}" class="space-y-4">
                @csrf
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" name="name" value="{{ old('name') }}" required class="input-field" placeholder="John Doe">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" name="email" value="{{ old('email') }}" required class="input-field" placeholder="you@example.com">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
                    <input type="tel" name="phone" value="{{ old('phone') }}" class="input-field" placeholder="+91 9999999999">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input type="password" name="password" required class="input-field" placeholder="Min 8 characters">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <input type="password" name="password_confirmation" required class="input-field" placeholder="Repeat password">
                </div>
                <button type="submit" class="btn-primary w-full py-3">Create Account</button>
            </form>
            <p class="text-center text-sm text-gray-500 mt-6">Already have an account? <a href="{{ route('login') }}" class="text-primary-600 font-medium hover:underline">Sign in</a></p>
        </div>
    </div>
</div>
@endsection
