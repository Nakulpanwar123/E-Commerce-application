@extends('layouts.app')

@push('schema')
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "{{ $blog->title }}",
    "description": "{{ $blog->excerpt }}",
    "image": "{{ $blog->cover_image }}",
    "author": { "@type": "Person", "name": "{{ $blog->author->name }}" },
    "publisher": { "@type": "Organization", "name": "{{ config('app.name') }}" },
    "datePublished": "{{ $blog->published_at->toISOString() }}",
    "dateModified": "{{ $blog->updated_at->toISOString() }}"
}
</script>
@endpush

@section('content')
<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <nav class="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <a href="{{ route('home') }}" class="hover:text-primary-600">Home</a>
        <span>/</span>
        <a href="{{ route('blog.index') }}" class="hover:text-primary-600">Blog</a>
        <span>/</span>
        <span class="text-gray-900">{{ $blog->title }}</span>
    </nav>

    <span class="badge bg-primary-100 text-primary-700 mb-4">{{ $blog->category }}</span>
    <h1 class="font-display text-4xl font-bold text-gray-900 mb-4 text-balance">{{ $blog->title }}</h1>
    <div class="flex items-center gap-3 text-sm text-gray-500 mb-8">
        <span>By {{ $blog->author->name }}</span>
        <span>·</span>
        <span>{{ $blog->published_at->format('M d, Y') }}</span>
        <span>·</span>
        <span>{{ $blog->views }} views</span>
    </div>

    @if($blog->cover_image)
    <div class="aspect-video rounded-2xl overflow-hidden mb-8">
        <img src="{{ $blog->cover_image }}" alt="{{ $blog->title }}" class="w-full h-full object-cover">
    </div>
    @endif

    <div class="prose prose-lg max-w-none text-gray-700">{!! $blog->body !!}</div>

    @if($related->count())
    <div class="mt-12 pt-8 border-t border-gray-100">
        <h2 class="font-semibold text-xl mb-6">Related Articles</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            @foreach($related as $post)
            <a href="{{ route('blog.show', $post->slug) }}" class="card group p-4 hover:shadow-md transition-shadow">
                <h3 class="font-medium text-gray-900 group-hover:text-primary-600 line-clamp-2">{{ $post->title }}</h3>
                <p class="text-xs text-gray-400 mt-2">{{ $post->published_at->format('M d, Y') }}</p>
            </a>
            @endforeach
        </div>
    </div>
    @endif
</div>
@endsection
