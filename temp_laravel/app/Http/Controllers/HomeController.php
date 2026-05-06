<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\FlashSale;
use App\Models\Product;
use Illuminate\Support\Facades\Cache;

class HomeController extends Controller
{
    public function index()
    {
        $data = Cache::remember('home_page', 3600, function () {
            return [
                'newArrivals'      => Product::active()->new()->inStock()->with(['images', 'reviews'])->latest()->take(8)->get(),
                'trendingProducts' => Product::active()->inStock()->with(['images', 'reviews'])->orderByDesc('views_count')->take(8)->get(),
                'flashSale'        => FlashSale::active()->with('products.images')->first(),
                'blogs'            => Blog::published()->latest('published_at')->take(3)->get(),
            ];
        });

        $flashSaleProducts = $data['flashSale']?->products->take(4) ?? collect();

        $seo = [
            'title'       => 'FashionStore – Premium Clothing for Men, Women & Kids',
            'description' => 'Shop the latest fashion trends at FashionStore. Premium quality clothing for men, women and kids. Free shipping on orders above ₹999.',
            'keywords'    => 'fashion, clothing, men fashion, women fashion, kids clothing, online shopping India',
            'og_type'     => 'website',
        ];

        return view('pages.home', array_merge($data, compact('flashSaleProducts', 'seo')));
    }
}
