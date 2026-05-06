@extends('layouts.app')
@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="section-title mb-2">Fashion Blog</h1>
    <p class="text-gray-500 mb-8">Style tips, trends & guides</p>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @foreach($blogs as $blog)
        <article class="card group">
            <a href="{{ route('blog.show', $blog->slug) }}">
                <div class="aspect-video overflow-hidden bg-gray-100">
                    <img data-src="{{ $blog->cover_image ?? asset('images/blog-placeholder.webp') }}" alt="{{ $blog->title }}"
                        class="w-full h-full object-cover skeleton group-hover:scale-105 transition-transform duration-300">
                </div>
                <div class="p-5">
                    <span class="badge bg-primary-100 text-primary-700 mb-2">{{ $blog->category }}</span>
                    <h2 class="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">{{ $blog->title }}</h2>
                    <p class="text-sm text-gray-500 mt-2 line-clamp-2">{{ $blog->excerpt }}</p>
                    <p class="text-xs text-gray-400 mt-3">{{ $blog->published_at->format('M d, Y') }}</p>
                </div>
            </a>
        </article>
        @endforeach
    </div>
    <div class="mt-8">{{ $blogs->links() }}</div>
</div>
@endsection
