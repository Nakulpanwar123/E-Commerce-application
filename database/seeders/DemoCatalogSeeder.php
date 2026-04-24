<?php

namespace Database\Seeders;

use App\Models\Blog;
use App\Models\Category;
use App\Models\FlashSale;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DemoCatalogSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            $author = User::firstOrCreate(
                ['email' => 'demo@fashionstore.local'],
                [
                    'name' => 'Fashion Store Demo',
                    'password' => Hash::make('password123'),
                    'phone' => '+910000000000',
                    'email_verified_at' => now(),
                    'referral_code' => strtoupper(Str::random(8)),
                ]
            );

            $categories = collect([
                ['name' => 'Men', 'slug' => 'men', 'sort_order' => 1],
                ['name' => 'Women', 'slug' => 'women', 'sort_order' => 2],
                ['name' => 'Kids', 'slug' => 'kids', 'sort_order' => 3],
                ['name' => 'New Arrivals', 'slug' => 'new-arrivals', 'sort_order' => 4],
                ['name' => 'Trending', 'slug' => 'trending', 'sort_order' => 5],
                ['name' => 'Shoes', 'slug' => 'shoes', 'sort_order' => 6],
                ['name' => 'Accessories', 'slug' => 'accessories', 'sort_order' => 7],
            ])->mapWithKeys(function (array $category) {
                $model = Category::updateOrCreate(
                    ['slug' => $category['slug']],
                    [
                        'name' => $category['name'],
                        'description' => $category['name'] . ' collection for the storefront demo.',
                        'sort_order' => $category['sort_order'],
                        'is_active' => true,
                    ]
                );

                return [$category['slug'] => $model];
            });

            $imageUrl = asset('images/demo/urban-tee.svg');

            $products = [
                [
                    'slug' => 'urban-oversized-tee',
                    'name' => 'Urban Oversized Tee',
                    'sku' => 'DEMO-TEE-001',
                    'brand' => 'FashionStore Studio',
                    'category' => 'men',
                    'description' => 'A premium oversized tee in heavyweight cotton for the rebuilt demo storefront.',
                    'original_price' => 1499,
                    'sale_price' => 999,
                    'stock' => 40,
                    'is_new' => true,
                    'is_featured' => true,
                    'views_count' => 120,
                    'variants' => [
                        ['size' => 'M', 'color' => 'Black', 'color_hex' => '#111111', 'sku' => 'DEMO-TEE-001-M-BLK', 'stock' => 10],
                        ['size' => 'L', 'color' => 'Black', 'color_hex' => '#111111', 'sku' => 'DEMO-TEE-001-L-BLK', 'stock' => 14],
                    ],
                ],
                [
                    'slug' => 'city-runner-sneaker',
                    'name' => 'City Runner Sneaker',
                    'sku' => 'DEMO-SHOE-001',
                    'brand' => 'FashionStore Move',
                    'category' => 'shoes',
                    'description' => 'Lightweight everyday sneakers designed to make the storefront feel alive.',
                    'original_price' => 2999,
                    'sale_price' => 2199,
                    'stock' => 25,
                    'is_new' => true,
                    'is_featured' => true,
                    'views_count' => 80,
                    'variants' => [
                        ['size' => '42', 'color' => 'White', 'color_hex' => '#F8F8F8', 'sku' => 'DEMO-SHOE-001-42-WHT', 'stock' => 8],
                    ],
                ],
                [
                    'slug' => 'studio-wrap-dress',
                    'name' => 'Studio Wrap Dress',
                    'sku' => 'DEMO-WMN-001',
                    'brand' => 'FashionStore Edit',
                    'category' => 'women',
                    'description' => 'A polished wrap dress so the women category has a real product card, detail page, and cart flow.',
                    'original_price' => 2599,
                    'sale_price' => 1899,
                    'stock' => 16,
                    'is_new' => true,
                    'is_featured' => true,
                    'views_count' => 95,
                    'variants' => [
                        ['size' => 'S', 'color' => 'Berry', 'color_hex' => '#A21CAF', 'sku' => 'DEMO-WMN-001-S-BRY', 'stock' => 7],
                        ['size' => 'M', 'color' => 'Berry', 'color_hex' => '#A21CAF', 'sku' => 'DEMO-WMN-001-M-BRY', 'stock' => 9],
                    ],
                ],
                [
                    'slug' => 'weekend-play-set',
                    'name' => 'Weekend Play Set',
                    'sku' => 'DEMO-KID-001',
                    'brand' => 'FashionStore Mini',
                    'category' => 'kids',
                    'description' => 'A comfortable matching set that gives the kids category a populated demo route.',
                    'original_price' => 1399,
                    'sale_price' => 999,
                    'stock' => 22,
                    'is_new' => false,
                    'is_featured' => true,
                    'views_count' => 55,
                    'variants' => [
                        ['size' => '6Y', 'color' => 'Sky', 'color_hex' => '#38BDF8', 'sku' => 'DEMO-KID-001-6Y-SKY', 'stock' => 10],
                        ['size' => '8Y', 'color' => 'Sky', 'color_hex' => '#38BDF8', 'sku' => 'DEMO-KID-001-8Y-SKY', 'stock' => 12],
                    ],
                ],
                [
                    'slug' => 'signature-carry-tote',
                    'name' => 'Signature Carry Tote',
                    'sku' => 'DEMO-ACC-001',
                    'brand' => 'FashionStore Edit',
                    'category' => 'accessories',
                    'description' => 'A structured tote bag for styling sections, cart demos, and outfit building.',
                    'original_price' => 1999,
                    'sale_price' => 1499,
                    'stock' => 18,
                    'is_new' => false,
                    'is_featured' => true,
                    'views_count' => 60,
                    'variants' => [
                        ['size' => 'One Size', 'color' => 'Tan', 'color_hex' => '#B47B52', 'sku' => 'DEMO-ACC-001-OS-TAN', 'stock' => 18],
                    ],
                ],
            ];

            $productModels = collect($products)->map(function (array $product) use ($categories, $imageUrl) {
                $model = Product::updateOrCreate(
                    ['slug' => $product['slug']],
                    [
                        'name' => $product['name'],
                        'sku' => $product['sku'],
                        'brand' => $product['brand'],
                        'category_id' => $categories[$product['category']]->id,
                        'description' => $product['description'],
                        'meta_title' => $product['name'] . ' | FashionStore',
                        'meta_description' => $product['description'],
                        'meta_keywords' => 'demo,fashion,storefront',
                        'original_price' => $product['original_price'],
                        'sale_price' => $product['sale_price'],
                        'stock' => $product['stock'],
                        'is_active' => true,
                        'is_featured' => $product['is_featured'],
                        'is_new' => $product['is_new'],
                        'views_count' => $product['views_count'],
                    ]
                );

                ProductImage::updateOrCreate(
                    ['product_id' => $model->id, 'sort_order' => 0],
                    ['url' => $imageUrl]
                );

                foreach ($product['variants'] as $variant) {
                    ProductVariant::updateOrCreate(
                        ['sku' => $variant['sku']],
                        array_merge($variant, ['product_id' => $model->id, 'price_modifier' => 0])
                    );
                }

                return $model;
            });

            $flashSale = FlashSale::updateOrCreate(
                ['name' => 'Weekend Launch Sale'],
                [
                    'discount_percent' => 20,
                    'starts_at' => now()->subDay(),
                    'ends_at' => now()->addDays(5),
                    'is_active' => true,
                ]
            );

            $flashSale->products()->syncWithoutDetaching($productModels->take(2)->pluck('id'));

            Blog::updateOrCreate(
                ['slug' => 'how-to-style-the-demo-drop'],
                [
                    'title' => 'How to Style the Demo Drop',
                    'excerpt' => 'A quick editorial story that gives the storefront blog and content cards something real to render.',
                    'body' => '<p>This demo article exists so the React storefront can show working editorial content. Pair the oversized tee with the tote for a balanced everyday look, then finish with the City Runner sneakers.</p><p>The point is not trend prophecy. It is giving the demo stack realistic data that exercises blog cards, article pages, and homepage content rails.</p>',
                    'cover_image' => $imageUrl,
                    'category' => 'Style Guide',
                    'author_id' => $author->id,
                    'meta_title' => 'How to Style the Demo Drop | FashionStore',
                    'meta_description' => 'Demo editorial content for the Laravel Vite React storefront.',
                    'is_published' => true,
                    'published_at' => now()->subHours(4),
                    'views' => 25,
                ]
            );
        });
    }
}
