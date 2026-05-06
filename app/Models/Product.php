<?php

namespace App\Models;

use App\Support\TaggedCache;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name', 'slug', 'sku', 'brand', 'category_id', 'description',
        'meta_title', 'meta_description', 'meta_keywords',
        'original_price', 'sale_price', 'stock', 'is_active',
        'is_featured', 'is_new', 'weight', 'video_url',
    ];

    protected $casts = ['is_active' => 'boolean', 'is_featured' => 'boolean', 'is_new' => 'boolean'];

    protected static function booted()
    {
        static::saved(fn() => TaggedCache::flush(['products']));
        static::deleted(fn() => TaggedCache::flush(['products']));
    }

    // Relationships
    public function category()  { return $this->belongsTo(Category::class); }
    public function variants()  { return $this->hasMany(ProductVariant::class); }
    public function images()    { return $this->hasMany(ProductImage::class)->orderBy('sort_order'); }
    public function reviews()   { return $this->hasMany(Review::class)->where('is_approved', true); }
    public function wishlists() { return $this->hasMany(Wishlist::class); }

    // Accessors
    public function getPrimaryImageAttribute(): string
    {
        return $this->images->first()?->url ?? asset('images/placeholder.webp');
    }

    public function getDiscountPercentAttribute(): int
    {
        if (!$this->original_price || $this->original_price <= $this->sale_price) return 0;
        return (int) round((($this->original_price - $this->sale_price) / $this->original_price) * 100);
    }

    public function getAvgRatingAttribute(): float
    {
        return round($this->reviews->avg('rating') ?? 0, 1);
    }

    public function getReviewsCountAttribute(): int
    {
        return $this->reviews->count();
    }

    public function getInStockAttribute(): bool
    {
        return $this->stock > 0;
    }

    public function getSizesAttribute()
    {
        return $this->variants->unique('size')->pluck('size')->filter();
    }

    public function getColorsAttribute()
    {
        return $this->variants->unique('color')->filter(fn($v) => $v->color);
    }

    public function getDefaultVariantIdAttribute(): ?int
    {
        return $this->variants->first()?->id;
    }

    // Scopes
    public function scopeActive($q)    { return $q->where('is_active', true); }
    public function scopeFeatured($q)  { return $q->where('is_featured', true); }
    public function scopeNew($q)       { return $q->where('is_new', true); }
    public function scopeInStock($q)   { return $q->where('stock', '>', 0); }

    public function scopeFilter($q, array $filters)
    {
        return $q
            ->when($filters['min_price'] ?? null, fn($q, $v) => $q->where('sale_price', '>=', $v))
            ->when($filters['max_price'] ?? null, fn($q, $v) => $q->where('sale_price', '<=', $v))
            ->when($filters['brands'] ?? null, fn($q, $v) => $q->whereIn('brand', $v))
            ->when($filters['sizes'] ?? null, fn($q, $v) => $q->whereHas('variants', fn($q) => $q->whereIn('size', $v)))
            ->when($filters['colors'] ?? null, fn($q, $v) => $q->whereHas('variants', fn($q) => $q->whereIn('color', $v)));
    }

    public function scopeSorted($q, string $sort = 'newest')
    {
        return match($sort) {
            'price_asc'  => $q->orderBy('sale_price'),
            'price_desc' => $q->orderByDesc('sale_price'),
            'popular'    => $q->orderByDesc('views_count'),
            'rating'     => $q->orderByDesc('avg_rating'),
            default      => $q->orderByDesc('created_at'),
        };
    }
}
