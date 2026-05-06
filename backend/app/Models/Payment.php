<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = ['order_id','gateway','gateway_order_id','gateway_payment_id','gateway_signature','amount','currency','status','gateway_response'];
    protected $casts = ['gateway_response' => 'array'];

    public function order() { return $this->belongsTo(Order::class); }
}
