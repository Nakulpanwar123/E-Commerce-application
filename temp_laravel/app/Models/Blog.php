<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    protected $fillable = ['title', 'slug', 'excerpt', 'body', 'cover_image', 'category', 'author_id', 'is_published', 'published_at', 'meta_title', 'meta_description', 'views'];

    protected $casts = ['is_published' => 'boolean', 'published_at' => 'datetime'];

    public function author() { return $this->belongsTo(User::class, 'author_id'); }

    public function scopePublished($q) { return $q->where('is_published', true)->where('published_at', '<=', now()); }
}
