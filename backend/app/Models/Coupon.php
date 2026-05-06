<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    protected $fillable = ['code','type','value','min_order_amount','max_discount','usage_limit','used_count','expires_at','is_active'];
    protected $casts = ['expires_at' => 'datetime', 'is_active' => 'boolean'];

    public function isValid(float $orderAmount): bool
    {
        if (!$this->is_active) return false;
        if ($this->expires_at && $this->expires_at->isPast()) return false;
        if ($this->usage_limit && $this->used_count >= $this->usage_limit) return false;
        if ($orderAmount < $this->min_order_amount) return false;
        return true;
    }

    public function calculateDiscount(float $amount): float
    {
        $discount = $this->type === 'percentage'
            ? ($amount * $this->value / 100)
            : $this->value;

        return $this->max_discount ? min($discount, $this->max_discount) : $discount;
    }
}
