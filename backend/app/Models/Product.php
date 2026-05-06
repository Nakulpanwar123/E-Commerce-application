<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id','brand_id','name','slug','short_description','description',
        'price','sale_price','sku','stock','thumbnail','images','tags',
        'material','care_instructions','meta_title','meta_description','meta_keywords',
        'is_active','is_featured','is_trending','avg_rating','review_count','view_count'
    ];

    protected $casts = [
        'images' => 'array',
        'tags' => 'array',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'is_trending' => 'boolean',
        'price' => 'decimal:2',
        'sale_price' => 'decimal:2',
    ];

    public function category() { return $this->belongsTo(Category::class); }
    public function brand() { return $this->belongsTo(Brand::class); }
    public function variants() { return $this->hasMany(ProductVariant::class); }
    public function reviews() { return $this->hasMany(Review::class)->where('is_approved', true); }
    public function wishlists() { return $this->hasMany(Wishlist::class); }

    public function getEffectivePriceAttribute(): float
    {
        return $this->sale_price ?? $this->price;
    }

    public function scopeActive($q) { return $q->where('is_active', true); }
    public function scopeFeatured($q) { return $q->where('is_featured', true); }
    public function scopeTrending($q) { return $q->where('is_trending', true); }

    public function scopeFilter($q, array $filters)
    {
        $q->when($filters['category'] ?? null, fn($q, $v) => $q->whereHas('category', fn($q) => $q->where('slug', $v)))
          ->when($filters['brand'] ?? null, fn($q, $v) => $q->whereHas('brand', fn($q) => $q->where('slug', $v)))
          ->when($filters['min_price'] ?? null, fn($q, $v) => $q->where('price', '>=', $v))
          ->when($filters['max_price'] ?? null, fn($q, $v) => $q->where('price', '<=', $v))
          ->when($filters['size'] ?? null, fn($q, $v) => $q->whereHas('variants', fn($q) => $q->where('size', $v)))
          ->when($filters['color'] ?? null, fn($q, $v) => $q->whereHas('variants', fn($q) => $q->where('color', $v)))
          ->when($filters['search'] ?? null, fn($q, $v) => $q->whereFullText(['name','description'], $v));

        $sort = $filters['sort'] ?? 'latest';
        match($sort) {
            'price_asc'  => $q->orderBy('price'),
            'price_desc' => $q->orderByDesc('price'),
            'popular'    => $q->orderByDesc('view_count'),
            'rating'     => $q->orderByDesc('avg_rating'),
            default      => $q->latest(),
        };

        return $q;
    }
}
