<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    protected $fillable = ['user_id','title','slug','excerpt','content','thumbnail','tags','meta_title','meta_description','is_published','published_at'];
    protected $casts = ['tags' => 'array', 'is_published' => 'boolean', 'published_at' => 'datetime'];

    public function author() { return $this->belongsTo(User::class, 'user_id'); }
    public function scopePublished($q) { return $q->where('is_published', true); }
}
