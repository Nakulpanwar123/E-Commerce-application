<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(): JsonResponse
    {
        $items = auth()->user()->wishlist()->with('product.category')->get();
        return response()->json($items);
    }

    public function toggle(Request $request): JsonResponse
    {
        $request->validate(['product_id' => 'required|exists:products,id']);

        $existing = Wishlist::where(['user_id' => auth()->id(), 'product_id' => $request->product_id])->first();

        if ($existing) {
            $existing->delete();
            return response()->json(['wishlisted' => false]);
        }

        Wishlist::create(['user_id' => auth()->id(), 'product_id' => $request->product_id]);
        return response()->json(['wishlisted' => true]);
    }
}
