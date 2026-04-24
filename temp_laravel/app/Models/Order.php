<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id', 'order_number', 'status', 'payment_method', 'payment_status',
        'subtotal', 'discount', 'shipping', 'tax', 'total',
        'coupon_code', 'coupon_discount',
        'shipping_name', 'shipping_phone', 'shipping_line1', 'shipping_city', 'shipping_state', 'shipping_pincode',
        'notes', 'tracking_number', 'shipped_at', 'delivered_at',
    ];

    protected $casts = ['shipped_at' => 'datetime', 'delivered_at' => 'datetime'];

    const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

    public function user()    { return $this->belongsTo(User::class); }
    public function items()   { return $this->hasMany(OrderItem::class); }
    public function payment() { return $this->hasOne(Payment::class); }

    protected static function booted()
    {
        static::creating(function ($order) {
            $order->order_number = 'FS-' . strtoupper(uniqid());
        });
    }

    public function getStatusBadgeAttribute(): string
    {
        return match($this->status) {
            'delivered'  => 'bg-green-100 text-green-700',
            'shipped'    => 'bg-blue-100 text-blue-700',
            'cancelled'  => 'bg-red-100 text-red-700',
            'refunded'   => 'bg-purple-100 text-purple-700',
            default      => 'bg-yellow-100 text-yellow-700',
        };
    }
}
