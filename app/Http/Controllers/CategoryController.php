<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller
{
    public function show(Request $request, string $slug)
    {
        $category = Cache::remember("category_{$slug}", 3600, fn() =>
            Category::active()->where('slug', $slug)->with('children')->firstOrFail()
        );

        $filters = $request->only(['min_price', 'max_price', 'sizes', 'colors', 'brands', 'sort']);

        $products = Product::active()
            ->inStock()
            ->where('category_id', $category->id)
            ->with(['images', 'reviews'])
            ->filter($filters)
            ->sorted($filters['sort'] ?? 'newest')
            ->paginate(24);

        $availableColors = Cache::remember("colors_{$slug}", 3600, fn() =>
            \App\Models\ProductVariant::whereHas('product', fn($q) => $q->where('category_id', $category->id))
                ->whereNotNull('color')->distinct()->get(['color', 'color_hex as hex', 'color as slug'])
        );

        $availableBrands = Cache::remember("brands_{$slug}", 3600, fn() =>
            Product::where('category_id', $category->id)->distinct()->pluck('brand')->filter()->sort()->values()
        );

        $breadcrumbs = $this->buildBreadcrumbs($category);

        $seo = [
            'title'       => ($category->meta_title ?: "Buy {$category->name} Online") . ' | FashionStore',
            'description' => $category->meta_description ?: "Shop {$category->name} at best prices. Free shipping on orders above ₹999.",
            'canonical'   => route('category', $slug),
        ];

        return view('pages.category', compact('category', 'products', 'availableColors', 'availableBrands', 'breadcrumbs', 'seo'));
    }

    public function sale()
    {
        $category = (object)['id' => null, 'name' => 'Sale', 'slug' => 'sale', 'children' => collect(), 'meta_title' => null, 'meta_description' => null];

        $products = Product::active()->inStock()
            ->whereColumn('sale_price', '<', 'original_price')
            ->with(['images', 'reviews'])
            ->sorted(request('sort', 'newest'))
            ->paginate(24);

        $availableColors = collect();
        $availableBrands = Product::whereColumn('sale_price', '<', 'original_price')->distinct()->pluck('brand')->filter()->sort()->values();
        $breadcrumbs = [['name' => 'Sale', 'url' => route('sale')]];

        $seo = ['title' => 'Sale – Up to 70% Off | FashionStore', 'description' => 'Shop the biggest sale on fashion. Up to 70% off on men, women and kids clothing.'];

        return view('pages.category', compact('category', 'products', 'availableColors', 'availableBrands', 'breadcrumbs', 'seo'));
    }

    private function buildBreadcrumbs(Category $category): array
    {
        $crumbs = [['name' => $category->name, 'url' => route('category', $category->slug)]];
        $parent = $category->parent;
        while ($parent) {
            array_unshift($crumbs, ['name' => $parent->name, 'url' => route('category', $parent->slug)]);
            $parent = $parent->parent;
        }
        return $crumbs;
    }
}
