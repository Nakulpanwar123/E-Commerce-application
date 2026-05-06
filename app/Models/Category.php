<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['name', 'slug', 'parent_id', 'description', 'image', 'meta_title', 'meta_description', 'is_active', 'sort_order'];

    protected $casts = ['is_active' => 'boolean'];

    public function parent()   { return $this->belongsTo(Category::class, 'parent_id'); }
    public function children() { return $this->hasMany(Category::class, 'parent_id'); }
    public function products() { return $this->hasMany(Product::class); }

    public function scopeActive($q) { return $q->where('is_active', true); }
    public function scopeRoot($q)   { return $q->whereNull('parent_id'); }
}
