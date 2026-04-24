<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FlashSale extends Model
{
    protected $fillable = ['name', 'discount_percent', 'starts_at', 'ends_at', 'is_active'];

    protected $casts = ['starts_at' => 'datetime', 'ends_at' => 'datetime', 'is_active' => 'boolean'];

    public function products() { return $this->belongsToMany(Product::class, 'flash_sale_products'); }

    public function scopeActive($q)
    {
        return $q->where('is_active', true)->where('starts_at', '<=', now())->where('ends_at', '>', now());
    }
}
