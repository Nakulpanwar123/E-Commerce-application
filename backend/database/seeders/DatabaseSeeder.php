<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Banner;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'name'     => 'Admin',
            'email'    => 'admin@fashionstore.com',
            'password' => Hash::make('password'),
            'role'     => 'admin',
        ]);

        // Categories
        $men   = Category::create(['name' => 'Men',   'slug' => 'men',   'sort_order' => 1]);
        $women = Category::create(['name' => 'Women', 'slug' => 'women', 'sort_order' => 2]);
        $kids  = Category::create(['name' => 'Kids',  'slug' => 'kids',  'sort_order' => 3]);

        $subCats = [
            [$men->id,   'T-Shirts',  't-shirts'],
            [$men->id,   'Shirts',    'shirts'],
            [$men->id,   'Jeans',     'jeans'],
            [$women->id, 'Dresses',   'dresses'],
            [$women->id, 'Tops',      'tops'],
            [$women->id, 'Sarees',    'sarees'],
            [$kids->id,  'Boys',      'boys'],
            [$kids->id,  'Girls',     'girls'],
        ];

        foreach ($subCats as [$parentId, $name, $slug]) {
            Category::create(['parent_id' => $parentId, 'name' => $name, 'slug' => $slug]);
        }

        // Brands
        $brands = ['Zara', 'H&M', 'Mango', 'Levi\'s', 'Nike', 'Adidas'];
        foreach ($brands as $b) {
            Brand::create(['name' => $b, 'slug' => Str::slug($b)]);
        }

        // Sample Products
        $categories = Category::whereNotNull('parent_id')->get();
        $brandIds   = Brand::pluck('id');
        $sizes      = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
        $colors     = [['Black', '#000000'], ['White', '#FFFFFF'], ['Navy', '#001F5B'], ['Red', '#FF0000']];

        for ($i = 1; $i <= 40; $i++) {
            $cat     = $categories->random();
            $price   = rand(499, 4999);
            $product = Product::create([
                'category_id'       => $cat->id,
                'brand_id'          => $brandIds->random(),
                'name'              => "Fashion Item {$i}",
                'slug'              => "fashion-item-{$i}",
                'short_description' => "Premium quality fashion item {$i}",
                'description'       => "Detailed description for fashion item {$i}. Made with premium materials.",
                'price'             => $price,
                'sale_price'        => $i % 3 === 0 ? $price * 0.8 : null,
                'sku'               => 'SKU-' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'stock'             => rand(10, 100),
                'thumbnail'         => "https://picsum.photos/seed/product{$i}/400/500",
                'images'            => ["https://picsum.photos/seed/product{$i}a/400/500", "https://picsum.photos/seed/product{$i}b/400/500"],
                'is_active'         => true,
                'is_featured'       => $i <= 8,
                'is_trending'       => $i > 8 && $i <= 16,
                'meta_title'        => "Fashion Item {$i} | FashionStore",
                'meta_description'  => "Buy Fashion Item {$i} at best price.",
            ]);

            foreach ($sizes as $size) {
                foreach ($colors as [$color, $hex]) {
                    ProductVariant::create([
                        'product_id'     => $product->id,
                        'size'           => $size,
                        'color'          => $color,
                        'color_hex'      => $hex,
                        'stock'          => rand(0, 20),
                        'price_modifier' => 0,
                        'sku'            => $product->sku . "-{$size}-" . strtoupper(substr($color, 0, 3)),
                    ]);
                }
            }
        }

        // Banners
        Banner::create(['title' => 'New Season Arrivals', 'subtitle' => 'Up to 50% off', 'image' => 'https://picsum.photos/seed/banner1/1400/600', 'position' => 'hero', 'sort_order' => 1, 'cta_text' => 'Shop Now', 'link' => '/products']);
        Banner::create(['title' => 'Women\'s Collection', 'subtitle' => 'Explore the latest trends', 'image' => 'https://picsum.photos/seed/banner2/1400/600', 'position' => 'hero', 'sort_order' => 2, 'cta_text' => 'Explore', 'link' => '/women']);
    }
}
