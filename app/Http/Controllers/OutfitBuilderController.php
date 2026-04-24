<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class OutfitBuilderController extends Controller
{
    public function index()
    {
        $categories = [
            'top'       => $this->getProducts(['men/t-shirts', 'women/tops', 'men/shirts']),
            'bottom'    => $this->getProducts(['men/jeans', 'women/jeans', 'men/trousers']),
            'shoes'     => $this->getProducts(['shoes']),
            'accessory' => $this->getProducts(['accessories']),
        ];

        return view('pages.outfit-builder', compact('categories'));
    }

    public function save(Request $request)
    {
        $request->validate(['items' => 'required|array']);

        auth()->user()->outfits()->create([
            'items' => $request->items,
            'name'  => 'My Outfit ' . now()->format('M d'),
        ]);

        return response()->json(['success' => true]);
    }

    private function getProducts(array $slugs)
    {
        return Cache::remember('outfit_' . implode('_', $slugs), 3600, fn() =>
            Product::active()->inStock()
                ->whereHas('category', fn($q) => $q->whereIn('slug', $slugs))
                ->with('images')->take(12)->get()
        );
    }
}
