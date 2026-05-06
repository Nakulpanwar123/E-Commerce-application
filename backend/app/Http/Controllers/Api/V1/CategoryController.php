<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Cache::remember('categories:all', 3600, fn() =>
            Category::with('children')->active()->root()->orderBy('sort_order')->get()
        );
        return response()->json($categories);
    }

    public function show(string $slug): JsonResponse
    {
        $category = Category::with(['children', 'products' => fn($q) => $q->active()->limit(4)])
            ->where('slug', $slug)->active()->firstOrFail();
        return response()->json($category);
    }
}
