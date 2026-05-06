<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Product $product): JsonResponse
    {
        $reviews = $product->reviews()->with('user:id,name,avatar')->latest()->paginate(10);
        $summary = [
            'avg'   => $product->avg_rating,
            'count' => $product->review_count,
            'breakdown' => Review::where('product_id', $product->id)->where('is_approved', true)
                ->selectRaw('rating, count(*) as count')->groupBy('rating')->pluck('count', 'rating'),
        ];
        return response()->json(compact('reviews', 'summary'));
    }

    public function store(Request $request, Product $product): JsonResponse
    {
        $request->validate([
            'rating' => 'required|integer|between:1,5',
            'title'  => 'nullable|string|max:100',
            'body'   => 'nullable|string|max:1000',
        ]);

        $review = Review::updateOrCreate(
            ['product_id' => $product->id, 'user_id' => auth()->id()],
            [...$request->only('rating', 'title', 'body'), 'is_approved' => false]
        );

        $this->recalculateRating($product);
        return response()->json($review, 201);
    }

    private function recalculateRating(Product $product): void
    {
        $stats = Review::where('product_id', $product->id)->where('is_approved', true)
            ->selectRaw('AVG(rating) as avg, COUNT(*) as count')->first();
        $product->update(['avg_rating' => round($stats->avg, 2), 'review_count' => $stats->count]);
    }
}
