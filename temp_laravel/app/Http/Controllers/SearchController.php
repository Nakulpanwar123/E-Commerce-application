<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SearchController extends Controller
{
    public function suggest(Request $request)
    {
        $q = $request->get('q', '');
        if (strlen($q) < 2) return response()->json([]);

        $results = Cache::remember("search_suggest_" . md5($q), 300, fn() =>
            Product::active()->inStock()
                ->where(fn($query) =>
                    $query->where('name', 'like', "%{$q}%")
                          ->orWhere('brand', 'like', "%{$q}%")
                )
                ->with('images')
                ->take(6)
                ->get()
                ->map(fn($p) => [
                    'id'    => $p->id,
                    'name'  => $p->name,
                    'price' => $p->sale_price,
                    'image' => $p->primary_image,
                    'url'   => route('product.show', $p->slug),
                ])
        );

        return response()->json($results);
    }

    public function index(Request $request)
    {
        $q = $request->get('q', '');

        $products = Product::active()->inStock()
            ->where(fn($query) =>
                $query->where('name', 'like', "%{$q}%")
                      ->orWhere('brand', 'like', "%{$q}%")
                      ->orWhere('description', 'like', "%{$q}%")
            )
            ->with(['images', 'reviews'])
            ->paginate(24);

        $seo = [
            'title'   => "Search results for \"{$q}\" | FashionStore",
            'robots'  => 'noindex, follow',
        ];

        return view('pages.search', compact('products', 'q', 'seo'));
    }
}
