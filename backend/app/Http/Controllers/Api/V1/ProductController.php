<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\ProductService;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(private ProductService $productService) {}

    public function index(Request $request): JsonResponse
    {
        $products = $this->productService->list($request->all(), $request->get('per_page', 20));
        return response()->json($products);
    }

    public function show(string $slug): JsonResponse
    {
        $product = $this->productService->findBySlug($slug);
        $this->productService->incrementView($product);
        $recommendations = $this->productService->getRecommendations($product);
        return response()->json(compact('product', 'recommendations'));
    }

    public function featured(): JsonResponse
    {
        $products = Product::with(['category', 'brand'])->active()->featured()->limit(12)->get();
        return response()->json($products);
    }

    public function trending(): JsonResponse
    {
        $products = Product::with(['category', 'brand'])->active()->trending()->limit(12)->get();
        return response()->json($products);
    }

    // Admin
    public function store(Request $request): JsonResponse
    {
        $this->authorize('admin');
        $product = $this->productService->create($request->all());
        return response()->json($product, 201);
    }

    public function update(Request $request, Product $product): JsonResponse
    {
        $this->authorize('admin');
        $product = $this->productService->update($product, $request->all());
        return response()->json($product);
    }

    public function destroy(Product $product): JsonResponse
    {
        $this->authorize('admin');
        $product->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
