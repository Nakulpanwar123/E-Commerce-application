<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Cart;
use App\Models\Category;
use App\Models\Coupon;
use App\Models\FlashSale;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Wishlist;
use App\Support\TaggedCache;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class StorefrontApiController extends Controller
{
    public function bootstrap(Request $request)
    {
        $rootCategories = Category::active()
            ->root()
            ->orderBy('sort_order')
            ->get(['name', 'slug']);

        return response()->json([
            'brand' => 'FashionStore',
            'promo' => 'Free shipping on orders over Rs.999 | Use code FASHION20 for 20% off',
            'navigation' => $rootCategories->map(fn(Category $category) => [
                'name' => $category->name,
                'slug' => $category->slug,
                'href' => '/' . $category->slug,
            ])->values(),
            'auth' => [
                'loggedIn' => auth()->check(),
                'user' => auth()->user() ? [
                    'name' => auth()->user()->name,
                    'isAdmin' => method_exists(auth()->user(), 'hasRole') ? auth()->user()->hasRole('admin') : false,
                ] : null,
            ],
            'counts' => [
                'cart' => Cart::where($this->identifier())->sum('quantity'),
                'wishlist' => auth()->check() ? Wishlist::where('user_id', auth()->id())->count() : 0,
            ],
        ]);
    }

    public function home()
    {
        $data = TaggedCache::remember(['products', 'home'], 'storefront_home', 3600, function () {
            return [
                'newArrivals' => Product::active()->new()->inStock()->with(['images', 'reviews'])->latest()->take(8)->get(),
                'trendingProducts' => Product::active()->inStock()->with(['images', 'reviews'])->orderByDesc('views_count')->take(8)->get(),
                'flashSale' => FlashSale::active()->with('products.images')->first(),
                'blogs' => Blog::published()->latest('published_at')->take(3)->get(),
            ];
        });

        $flashSaleProducts = $data['flashSale']?->products->take(4) ?? collect();

        return response()->json([
            'hero' => [
                'eyebrow' => 'New Collection 2025',
                'title' => 'Dress Your Story',
                'subtitle' => 'Discover premium fashion curated for every occasion. From casual to couture, find your perfect look.',
                'primaryCta' => ['label' => 'Shop Women', 'href' => '/women'],
                'secondaryCta' => ['label' => 'Shop Men', 'href' => '/men'],
            ],
            'categories' => [
                ['name' => 'Men', 'slug' => 'men', 'image' => asset('images/categories/men-category.svg'), 'cta' => "Shop Men's Collection"],
                ['name' => 'Women', 'slug' => 'women', 'image' => asset('images/categories/women-category.svg'), 'cta' => "Shop Women's Collection"],
                ['name' => 'Kids', 'slug' => 'kids', 'image' => asset('images/categories/kids-category.svg'), 'cta' => "Shop Kids' Collection"],
            ],
            'flashSale' => $data['flashSale'] ? [
                'name' => $data['flashSale']->name,
                'endsAt' => optional($data['flashSale']->ends_at)?->toIso8601String(),
                'products' => $flashSaleProducts->map(fn(Product $product) => $this->productCard($product))->values(),
            ] : null,
            'newArrivals' => $data['newArrivals']->map(fn(Product $product) => $this->productCard($product))->values(),
            'trendingProducts' => $data['trendingProducts']->map(fn(Product $product) => $this->productCard($product))->values(),
            'blogs' => $data['blogs']->map(fn(Blog $blog) => $this->blogCard($blog))->values(),
            'trustBadges' => [
                ['title' => 'Free Shipping', 'description' => 'On orders above Rs.999'],
                ['title' => 'Easy Returns', 'description' => '30-day hassle-free returns'],
                ['title' => 'Secure Payment', 'description' => '100% secure transactions'],
                ['title' => 'Premium Quality', 'description' => 'Curated fashion brands'],
            ],
        ]);
    }

    public function category(Request $request, string $slug)
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
            ProductVariant::whereHas('product', fn($query) => $query->where('category_id', $category->id))
                ->whereNotNull('color')
                ->distinct()
                ->get(['color', 'color_hex as hex', 'color as slug'])
        );

        $availableBrands = Cache::remember("brands_{$slug}", 3600, fn() =>
            Product::where('category_id', $category->id)->distinct()->pluck('brand')->filter()->sort()->values()
        );

        return response()->json([
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
            ],
            'products' => $products->getCollection()->map(fn(Product $product) => $this->productCard($product))->values(),
            'filters' => [
                'brands' => $availableBrands->values(),
                'colors' => $availableColors->map(fn($color) => [
                    'name' => $color->color,
                    'slug' => $color->slug,
                    'hex' => $color->hex,
                ])->values(),
                'sort' => $filters['sort'] ?? 'newest',
            ],
            'pagination' => [
                'currentPage' => $products->currentPage(),
                'lastPage' => $products->lastPage(),
                'perPage' => $products->perPage(),
                'total' => $products->total(),
            ],
        ]);
    }

    public function sale(Request $request)
    {
        $products = Product::active()
            ->inStock()
            ->whereColumn('sale_price', '<', 'original_price')
            ->with(['images', 'reviews'])
            ->sorted($request->string('sort')->toString() ?: 'newest')
            ->paginate(24);

        $availableBrands = Product::whereColumn('sale_price', '<', 'original_price')
            ->distinct()
            ->pluck('brand')
            ->filter()
            ->sort()
            ->values();

        return response()->json([
            'category' => [
                'name' => 'Sale',
                'slug' => 'sale',
                'description' => 'Shop the biggest sale on fashion. Up to 70% off on men, women and kids clothing.',
            ],
            'products' => $products->getCollection()->map(fn(Product $product) => $this->productCard($product))->values(),
            'filters' => [
                'brands' => $availableBrands,
                'colors' => [],
                'sort' => $request->string('sort')->toString() ?: 'newest',
            ],
            'pagination' => [
                'currentPage' => $products->currentPage(),
                'lastPage' => $products->lastPage(),
                'perPage' => $products->perPage(),
                'total' => $products->total(),
            ],
        ]);
    }

    public function product(string $slug)
    {
        $product = TaggedCache::remember(['products'], "product_spa_{$slug}", 1800, fn() =>
            Product::active()
                ->with(['category.parent', 'images', 'variants', 'reviews.user'])
                ->where('slug', $slug)
                ->firstOrFail()
        );

        Product::where('id', $product->id)->increment('views_count');

        $relatedProducts = TaggedCache::remember(['products'], "related_spa_{$product->id}", 3600, fn() =>
            Product::active()->inStock()
                ->where('category_id', $product->category_id)
                ->where('id', '!=', $product->id)
                ->with(['images', 'reviews'])
                ->take(8)
                ->get()
        );

        return response()->json([
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'brand' => $product->brand,
                'description' => $product->description,
                'originalPrice' => (float) $product->original_price,
                'salePrice' => (float) $product->sale_price,
                'discountPercent' => $product->discount_percent,
                'avgRating' => $product->avg_rating,
                'reviewsCount' => $product->reviews_count,
                'stock' => $product->stock,
                'category' => [
                    'name' => optional($product->category)->name,
                    'slug' => optional($product->category)->slug,
                ],
                'images' => $product->images->map(fn($image) => [
                    'id' => $image->id,
                    'url' => $image->url,
                ])->values(),
                'variants' => $product->variants->map(fn($variant) => [
                    'id' => $variant->id,
                    'size' => $variant->size,
                    'color' => $variant->color,
                    'stock' => $variant->stock,
                ])->values(),
                'reviews' => $product->reviews->map(fn($review) => [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'title' => $review->title,
                    'comment' => $review->comment,
                    'user' => optional($review->user)->name,
                    'createdAt' => optional($review->created_at)?->format('M d, Y'),
                ])->values(),
                'defaultVariantId' => $product->default_variant_id,
            ],
            'relatedProducts' => $relatedProducts->map(fn(Product $related) => $this->productCard($related))->values(),
        ]);
    }

    public function search(Request $request)
    {
        $query = $request->string('q')->toString();

        $products = Product::active()->inStock()
            ->where(fn($builder) =>
                $builder->where('name', 'like', "%{$query}%")
                    ->orWhere('brand', 'like', "%{$query}%")
                    ->orWhere('description', 'like', "%{$query}%")
            )
            ->with(['images', 'reviews'])
            ->paginate(24);

        return response()->json([
            'query' => $query,
            'products' => $products->getCollection()->map(fn(Product $product) => $this->productCard($product))->values(),
            'pagination' => [
                'currentPage' => $products->currentPage(),
                'lastPage' => $products->lastPage(),
                'perPage' => $products->perPage(),
                'total' => $products->total(),
            ],
        ]);
    }

    public function cart()
    {
        $cartItems = Cart::where($this->identifier())->with(['product.images', 'variant'])->get();
        [$subtotal, $discount, $shipping, $tax, $total] = $this->calculateTotals($cartItems);

        return response()->json([
            'items' => $cartItems->map(fn(Cart $item) => [
                'id' => $item->id,
                'quantity' => $item->quantity,
                'variant' => $item->variant ? [
                    'id' => $item->variant->id,
                    'size' => $item->variant->size,
                    'color' => $item->variant->color,
                ] : null,
                'product' => $this->productCard($item->product),
            ])->values(),
            'totals' => compact('subtotal', 'discount', 'shipping', 'tax', 'total'),
        ]);
    }

    public function wishlist()
    {
        abort_unless(auth()->check(), 401);

        $items = Wishlist::where('user_id', auth()->id())->with(['product.images', 'product.reviews'])->get();

        return response()->json([
            'items' => $items->map(fn(Wishlist $item) => $this->productCard($item->product))->values(),
        ]);
    }

    public function outfitBuilder()
    {
        abort_unless(auth()->check(), 401);

        return response()->json([
            'categories' => [
                'top' => $this->getOutfitProducts(['men/t-shirts', 'women/tops', 'men/shirts']),
                'bottom' => $this->getOutfitProducts(['men/jeans', 'women/jeans', 'men/trousers']),
                'shoes' => $this->getOutfitProducts(['shoes']),
                'accessory' => $this->getOutfitProducts(['accessories']),
            ],
        ]);
    }

    public function blogs()
    {
        $blogs = Blog::published()->latest('published_at')->paginate(9);

        return response()->json([
            'blogs' => $blogs->getCollection()->map(fn(Blog $blog) => $this->blogCard($blog))->values(),
            'pagination' => [
                'currentPage' => $blogs->currentPage(),
                'lastPage' => $blogs->lastPage(),
                'perPage' => $blogs->perPage(),
                'total' => $blogs->total(),
            ],
        ]);
    }

    public function blog(string $slug)
    {
        $blog = Blog::published()->where('slug', $slug)->firstOrFail();

        return response()->json([
            'blog' => [
                'id' => $blog->id,
                'title' => $blog->title,
                'slug' => $blog->slug,
                'excerpt' => $blog->excerpt,
                'body' => $blog->body,
                'coverImage' => $blog->cover_image,
                'category' => $blog->category,
                'publishedAt' => optional($blog->published_at)?->format('M d, Y'),
                'author' => optional($blog->author)->name,
            ],
        ]);
    }

    private function productCard(?Product $product): array
    {
        if (!$product) {
            return [];
        }

        $product->loadMissing(['images', 'reviews']);

        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'brand' => $product->brand,
            'image' => $product->primary_image,
            'originalPrice' => (float) $product->original_price,
            'salePrice' => (float) $product->sale_price,
            'discountPercent' => $product->discount_percent,
            'avgRating' => $product->avg_rating,
            'reviewsCount' => $product->reviews_count,
            'isNew' => (bool) $product->is_new,
            'defaultVariantId' => $product->default_variant_id,
            'href' => '/p/' . $product->slug,
        ];
    }

    private function blogCard(Blog $blog): array
    {
        return [
            'id' => $blog->id,
            'title' => $blog->title,
            'slug' => $blog->slug,
            'excerpt' => $blog->excerpt,
            'coverImage' => $blog->cover_image,
            'category' => $blog->category,
            'publishedAt' => optional($blog->published_at)?->format('M d, Y'),
            'href' => '/blog/' . $blog->slug,
        ];
    }

    private function getOutfitProducts(array $slugs)
    {
        return Cache::remember('spa_outfit_' . implode('_', $slugs), 3600, fn() =>
            Product::active()
                ->inStock()
                ->whereHas('category', fn($query) => $query->whereIn('slug', $slugs))
                ->with(['images', 'reviews'])
                ->take(12)
                ->get()
                ->map(fn(Product $product) => $this->productCard($product))
                ->values()
        );
    }

    private function calculateTotals($cartItems): array
    {
        $subtotal = $cartItems->sum(fn($item) => $item->product->sale_price * $item->quantity);
        $discount = 0;

        if ($couponId = session('coupon_id')) {
            $coupon = Coupon::find($couponId);
            $discount = $coupon?->calculateDiscount($subtotal) ?? 0;
        }

        $shipping = ($subtotal - $discount) >= 999 ? 0 : 99;
        $tax = round(($subtotal - $discount) * 0.18, 2);
        $total = $subtotal - $discount + $shipping + $tax;

        return [$subtotal, $discount, $shipping, $tax, $total];
    }

    private function identifier(): array
    {
        return auth()->check()
            ? ['user_id' => auth()->id()]
            : ['session_id' => session()->getId()];
    }
}
