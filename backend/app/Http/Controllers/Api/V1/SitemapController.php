<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\Blog;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $products   = Product::active()->select('slug', 'updated_at')->get();
        $categories = Category::active()->select('slug', 'updated_at')->get();
        $blogs      = Blog::published()->select('slug', 'updated_at')->get();

        $xml = view('sitemap', compact('products', 'categories', 'blogs'))->render();

        return response($xml, 200, ['Content-Type' => 'application/xml']);
    }
}
