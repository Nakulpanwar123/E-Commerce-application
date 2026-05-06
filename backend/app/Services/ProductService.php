<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class ProductService
{
    public function list(array $filters, int $perPage = 20)
    {
        return Product::with(['category', 'brand', 'variants'])
            ->active()
            ->filter($filters)
            ->paginate($perPage);
    }

    public function findBySlug(string $slug): Product
    {
        return Cache::remember("product:{$slug}", 3600, fn() =>
            Product::with(['category', 'brand', 'variants', 'reviews.user'])
                ->where('slug', $slug)
                ->active()
                ->firstOrFail()
        );
    }

    public function create(array $data): Product
    {
        $data['slug'] = Str::slug($data['name']);
        $data['sku']  = $data['sku'] ?? strtoupper(Str::random(8));

        if (isset($data['thumbnail']) && $data['thumbnail'] instanceof \Illuminate\Http\UploadedFile) {
            $data['thumbnail'] = Storage::disk('s3')->put('products', $data['thumbnail']);
        }

        $product = Product::create($data);

        if (!empty($data['variants'])) {
            foreach ($data['variants'] as $variant) {
                $variant['sku'] = $product->sku . '-' . strtoupper(Str::random(4));
                $product->variants()->create($variant);
            }
        }

        Cache::tags('products')->flush();
        return $product->load(['category', 'brand', 'variants']);
    }

    public function update(Product $product, array $data): Product
    {
        if (isset($data['name'])) $data['slug'] = Str::slug($data['name']);
        $product->update($data);
        Cache::forget("product:{$product->slug}");
        return $product->fresh(['category', 'brand', 'variants']);
    }

    public function incrementView(Product $product): void
    {
        $product->increment('view_count');
        Cache::forget("product:{$product->slug}");
    }

    public function getRecommendations(Product $product, int $limit = 8)
    {
        return Cache::remember("recommendations:{$product->id}", 1800, fn() =>
            Product::with(['category', 'brand'])
                ->active()
                ->where('category_id', $product->category_id)
                ->where('id', '!=', $product->id)
                ->orderByDesc('avg_rating')
                ->limit($limit)
                ->get()
        );
    }
}
