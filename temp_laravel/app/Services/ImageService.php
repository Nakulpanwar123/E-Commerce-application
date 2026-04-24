<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

class ImageService
{
    public function upload(UploadedFile $file, string $folder = 'products'): array
    {
        $name = uniqid() . '.webp';
        $path = "{$folder}/{$name}";

        // Convert to WebP and create multiple sizes
        $image = Image::make($file);

        // Original (max 1200px)
        $original = $image->resize(1200, null, fn($c) => $c->aspectRatio()->upsize())->encode('webp', 85);
        Storage::disk('s3')->put($path, $original);

        // Thumbnail (400px)
        $thumbName = "{$folder}/thumb_{$name}";
        $thumb = $image->resize(400, null, fn($c) => $c->aspectRatio()->upsize())->encode('webp', 80);
        Storage::disk('s3')->put($thumbName, $thumb);

        return [
            'url'      => Storage::disk('s3')->url($path),
            'thumb'    => Storage::disk('s3')->url($thumbName),
            'srcset'   => Storage::disk('s3')->url($thumbName) . ' 400w, ' . Storage::disk('s3')->url($path) . ' 1200w',
        ];
    }

    public function delete(string $url): void
    {
        $path = parse_url($url, PHP_URL_PATH);
        Storage::disk('s3')->delete(ltrim($path, '/'));
    }
}
