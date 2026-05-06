<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Support\TaggedCache;

class ProductController extends Controller
{
    public function show(string $slug)
    {
        $product = TaggedCache::remember(['products'], "product_{$slug}", 1800, fn() =>
            Product::active()
                ->with(['category.parent', 'images', 'variants', 'reviews.user'])
                ->where('slug', $slug)
                ->firstOrFail()
        );

        // Increment view count (async via queue in production)
        Product::where('id', $product->id)->increment('views_count');

        $relatedProducts = TaggedCache::remember(['products'], "related_{$product->id}", 3600, fn() =>
            Product::active()->inStock()
                ->where('category_id', $product->category_id)
                ->where('id', '!=', $product->id)
                ->with(['images', 'reviews'])
                ->take(8)->get()
        );

        $seo = [
            'title'       => ($product->meta_title ?: $product->name) . ' | FashionStore',
            'description' => $product->meta_description ?: "Buy {$product->name} at ₹{$product->sale_price}. " . strip_tags(substr($product->description, 0, 120)),
            'keywords'    => $product->meta_keywords,
            'og_type'     => 'product',
            'og_image'    => $product->primary_image,
            'canonical'   => route('product.show', $product->slug),
        ];

        return view('pages.product', compact('product', 'relatedProducts', 'seo'));
    }
}
