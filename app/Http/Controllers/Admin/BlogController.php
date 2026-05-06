<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    public function index()
    {
        $blogs = Blog::with('author')->latest()->paginate(20);
        return view('admin.blogs.index', compact('blogs'));
    }

    public function create()
    {
        return view('admin.blogs.form');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'            => 'required|string|max:255',
            'excerpt'          => 'required|string|max:500',
            'body'             => 'required|string',
            'category'         => 'required|string|max:50',
            'cover_image'      => 'nullable|url',
            'meta_title'       => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'is_published'     => 'boolean',
        ]);

        $data['slug']       = Str::slug($data['title']) . '-' . uniqid();
        $data['author_id']  = auth()->id();
        $data['published_at'] = $data['is_published'] ? now() : null;

        Blog::create($data);
        return redirect()->route('admin.blogs.index')->with('success', 'Blog post created.');
    }

    public function edit(Blog $blog)
    {
        return view('admin.blogs.form', compact('blog'));
    }

    public function update(Request $request, Blog $blog)
    {
        $data = $request->validate([
            'title'        => 'required|string|max:255',
            'excerpt'      => 'required|string|max:500',
            'body'         => 'required|string',
            'is_published' => 'boolean',
        ]);

        if ($data['is_published'] && !$blog->published_at) {
            $data['published_at'] = now();
        }

        $blog->update($data);
        return back()->with('success', 'Blog post updated.');
    }

    public function destroy(Blog $blog)
    {
        $blog->delete();
        return back()->with('success', 'Blog post deleted.');
    }
}
