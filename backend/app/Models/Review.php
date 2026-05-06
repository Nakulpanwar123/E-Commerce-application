<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = ['product_id','user_id','order_id','rating','title','body','images','is_approved'];
    protected $casts = ['images' => 'array', 'is_approved' => 'boolean'];

    public function user() { return $this->belongsTo(User::class); }
    public function product() { return $this->belongsTo(Product::class); }
}
