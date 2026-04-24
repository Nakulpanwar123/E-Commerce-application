<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Category;
use App\Models\Product;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class SitemapController extends Controller
{
    public function index()
    {
        $sitemap = Sitemap::create()
            ->add(Url::create('/')->setPriority(1.0)->setChangeFrequency('daily'));

        // Categories
        Category::active()->get()->each(fn($c) =>
            $sitemap->add(Url::create(route('category', $c->slug))->setPriority(0.9)->setChangeFrequency('daily'))
        );

        // Products
        Product::active()->select(['slug', 'updated_at'])->get()->each(fn($p) =>
            $sitemap->add(Url::create(route('product.show', $p->slug))->setLastModificationDate($p->updated_at)->setPriority(0.8)->setChangeFrequency('weekly'))
        );

        // Blogs
        Blog::published()->select(['slug', 'updated_at'])->get()->each(fn($b) =>
            $sitemap->add(Url::create(route('blog.show', $b->slug))->setLastModificationDate($b->updated_at)->setPriority(0.6)->setChangeFrequency('monthly'))
        );

        return response($sitemap->render(), 200, ['Content-Type' => 'application/xml']);
    }
}
