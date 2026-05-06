<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'order_number','user_id','coupon_id','shipping_address','subtotal',
        'discount','shipping_charge','tax','total','status','payment_method',
        'payment_status','tracking_number','notes'
    ];

    protected $casts = [
        'shipping_address' => 'array',
        'subtotal' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public function user() { return $this->belongsTo(User::class); }
    public function items() { return $this->hasMany(OrderItem::class); }
    public function payment() { return $this->hasOne(Payment::class); }
    public function coupon() { return $this->belongsTo(Coupon::class); }

    public static function generateOrderNumber(): string
    {
        return 'FS-' . strtoupper(uniqid());
    }
}
