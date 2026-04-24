<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Outfit extends Model
{
    protected $fillable = ['user_id', 'name', 'items'];

    protected $casts = ['items' => 'array'];

    public function user() { return $this->belongsTo(User::class); }
}
