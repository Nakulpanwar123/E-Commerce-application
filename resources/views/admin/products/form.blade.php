@extends('layouts.admin')
@section('title', isset($product) ? 'Edit Product' : 'Add Product')
@section('content')
<div class="max-w-3xl">
    <form method="POST" action="{{ isset($product) ? route('admin.products.update', $product) : route('admin.products.store') }}" enctype="multipart/form-data" class="space-y-6">
        @csrf
        @if(isset($product)) @method('PUT') @endif

        @if($errors->any())
        <div class="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">{{ $errors->first() }}</div>
        @endif

        <div class="card p-6 space-y-4">
            <h2 class="font-semibold text-gray-900">Basic Info</h2>
            <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                    <input type="text" name="name" value="{{ old('name', $product->name ?? '') }}" required class="input-field">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
                    <input type="text" name="brand" value="{{ old('brand', $product->brand ?? '') }}" required class="input-field">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select name="category_id" required class="input-field">
                        <option value="">Select category</option>
                        @foreach($categories as $cat)
                        <option value="{{ $cat->id }}" {{ old('category_id', $product->category_id ?? '') == $cat->id ? 'selected' : '' }}>{{ $cat->name }}</option>
                        @endforeach
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Original Price (₹) *</label>
                    <input type="number" name="original_price" value="{{ old('original_price', $product->original_price ?? '') }}" required step="0.01" class="input-field">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Sale Price (₹) *</label>
                    <input type="number" name="sale_price" value="{{ old('sale_price', $product->sale_price ?? '') }}" required step="0.01" class="input-field">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                    <input type="number" name="stock" value="{{ old('stock', $product->stock ?? 0) }}" required min="0" class="input-field">
                </div>
                <div class="flex items-center gap-4 pt-6">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="is_active" value="1" {{ old('is_active', $product->is_active ?? true) ? 'checked' : '' }} class="rounded text-primary-600">
                        <span class="text-sm font-medium text-gray-700">Active</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="is_featured" value="1" {{ old('is_featured', $product->is_featured ?? false) ? 'checked' : '' }} class="rounded text-primary-600">
                        <span class="text-sm font-medium text-gray-700">Featured</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="is_new" value="1" {{ old('is_new', $product->is_new ?? false) ? 'checked' : '' }} class="rounded text-primary-600">
                        <span class="text-sm font-medium text-gray-700">New</span>
                    </label>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea name="description" rows="5" required class="input-field">{{ old('description', $product->description ?? '') }}</textarea>
            </div>
        </div>

        <div class="card p-6 space-y-4">
            <h2 class="font-semibold text-gray-900">SEO</h2>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                <input type="text" name="meta_title" value="{{ old('meta_title', $product->meta_title ?? '') }}" class="input-field" placeholder="Leave blank to use product name">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                <textarea name="meta_description" rows="2" class="input-field" placeholder="Max 160 characters">{{ old('meta_description', $product->meta_description ?? '') }}</textarea>
            </div>
        </div>

        <div class="card p-6">
            <h2 class="font-semibold text-gray-900 mb-4">Images</h2>
            @if(isset($product) && $product->images->count())
            <div class="flex gap-3 mb-4 flex-wrap">
                @foreach($product->images as $img)
                <div class="relative">
                    <img src="{{ $img->url }}" alt="" class="w-20 h-20 object-cover rounded-xl">
                </div>
                @endforeach
            </div>
            @endif
            <input type="file" name="images[]" multiple accept="image/*" class="text-sm text-gray-600">
            <p class="text-xs text-gray-400 mt-1">Upload JPG, PNG or WebP. Max 5MB each. Images will be auto-converted to WebP.</p>
        </div>

        <div class="flex gap-3">
            <button type="submit" class="btn-primary">{{ isset($product) ? 'Update Product' : 'Create Product' }}</button>
            <a href="{{ route('admin.products.index') }}" class="btn-ghost">Cancel</a>
        </div>
    </form>
</div>
@endsection
