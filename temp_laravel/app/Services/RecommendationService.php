<?php

namespace App\Services;

use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\Cache;

class RecommendationService
{
    public function forUser(User $user, int $limit = 8)
    {
        return Cache::remember("recommendations_{$user->id}", 1800, function () use ($user, $limit) {
            // Get categories from recent orders
            $purchasedCategories = $user->orders()
                ->with('items.product')
                ->latest()->take(5)->get()
                ->flatMap(fn($o) => $o->items->pluck('product.category_id'))
                ->unique()->values();

            if ($purchasedCategories->isEmpty()) {
                return Product::active()->inStock()->with(['images', 'reviews'])
                    ->orderByDesc('views_count')->take($limit)->get();
            }

            return Product::active()->inStock()
                ->whereIn('category_id', $purchasedCategories)
                ->whereNotIn('id', $user->orders->flatMap(fn($o) => $o->items->pluck('product_id')))
                ->with(['images', 'reviews'])
                ->orderByDesc('views_count')
                ->take($limit)->get();
        });
    }

    public function similar(Product $product, int $limit = 8)
    {
        return Cache::remember("similar_{$product->id}", 3600, fn() =>
            Product::active()->inStock()
                ->where('category_id', $product->category_id)
                ->where('id', '!=', $product->id)
                ->with(['images', 'reviews'])
                ->orderByDesc('views_count')
                ->take($limit)->get()
        );
    }
}
