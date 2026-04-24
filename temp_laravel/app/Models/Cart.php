<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $fillable = ['user_id', 'session_id', 'product_id', 'variant_id', 'quantity'];

    public function product() { return $this->belongsTo(Product::class); }
    public function variant() { return $this->belongsTo(ProductVariant::class); }

    public function scopeForUser($q, $userId, $sessionId)
    {
        return $q->where(fn($q) => $q->where('user_id', $userId)->orWhere('session_id', $sessionId));
    }
}
