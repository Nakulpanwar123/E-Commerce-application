<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $blogs = Blog::published()
            ->when($request->tag, fn($q, $v) => $q->whereJsonContains('tags', $v))
            ->latest('published_at')
            ->paginate(9);
        return response()->json($blogs);
    }

    public function show(string $slug): JsonResponse
    {
        $blog = Blog::published()->where('slug', $slug)->firstOrFail();
        return response()->json($blog->load('author:id,name,avatar'));
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title'   => 'required|string|max:200',
            'content' => 'required|string',
            'excerpt' => 'nullable|string|max:300',
        ]);

        $blog = Blog::create([
            ...$request->only('title','content','excerpt','tags','meta_title','meta_description'),
            'slug'         => Str::slug($request->title),
            'user_id'      => auth()->id(),
            'is_published' => $request->boolean('is_published'),
            'published_at' => $request->boolean('is_published') ? now() : null,
        ]);

        return response()->json($blog, 201);
    }
}
