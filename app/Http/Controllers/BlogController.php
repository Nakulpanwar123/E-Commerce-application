<?php

namespace App\Http\Controllers;

use App\Models\Blog;

class BlogController extends Controller
{
    public function index()
    {
        $blogs = Blog::published()->latest('published_at')->paginate(12);

        $seo = [
            'title'       => 'Fashion Blog – Style Tips, Trends & Guides | FashionStore',
            'description' => 'Explore fashion tips, style guides, and the latest clothing trends on the FashionStore blog.',
        ];

        return view('pages.blog.index', compact('blogs', 'seo'));
    }

    public function show(string $slug)
    {
        $blog = Blog::published()->where('slug', $slug)->firstOrFail();
        $blog->increment('views');

        $related = Blog::published()->where('id', '!=', $blog->id)
            ->where('category', $blog->category)->latest('published_at')->take(3)->get();

        $seo = [
            'title'       => ($blog->meta_title ?: $blog->title) . ' | FashionStore Blog',
            'description' => $blog->meta_description ?: $blog->excerpt,
            'og_type'     => 'article',
            'og_image'    => $blog->cover_image,
            'canonical'   => route('blog.show', $blog->slug),
        ];

        return view('pages.blog.show', compact('blog', 'related', 'seo'));
    }
}
