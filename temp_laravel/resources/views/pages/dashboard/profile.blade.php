@extends('layouts.app')
@section('content')
<div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="section-title mb-8">My Profile</h1>
    @if(session('success'))
    <div class="bg-green-50 text-green-700 px-4 py-3 rounded-xl mb-6">{{ session('success') }}</div>
    @endif
    <form method="POST" action="{{ route('profile.update') }}" class="card p-6 space-y-4">
        @csrf @method('PATCH')
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" name="name" value="{{ old('name', $user->name) }}" required class="input-field">
            @error('name')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" value="{{ old('email', $user->email) }}" required class="input-field">
            @error('email')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="tel" name="phone" value="{{ old('phone', $user->phone) }}" class="input-field">
        </div>
        <button type="submit" class="btn-primary">Save Changes</button>
    </form>
</div>
@endsection
