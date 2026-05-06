<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\CartService;
use App\Models\CartItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function __construct(private CartService $cartService) {}

    private function resolveCart(Request $request)
    {
        return $this->cartService->getOrCreate(
            auth()->id(),
            $request->header('X-Session-Id')
        );
    }

    public function index(Request $request): JsonResponse
    {
        $cart = $this->cartService->getCartWithItems($this->resolveCart($request));
        return response()->json($cart);
    }

    public function add(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'required|integer|min:1',
            'variant_id' => 'nullable|exists:product_variants,id',
        ]);

        $cart = $this->resolveCart($request);
        $item = $this->cartService->addItem($cart, $request->product_id, $request->quantity, $request->variant_id);
        return response()->json($item->load('product', 'variant'), 201);
    }

    public function update(Request $request, CartItem $item): JsonResponse
    {
        $request->validate(['quantity' => 'required|integer|min:1']);
        $item = $this->cartService->updateItem($item, $request->quantity);
        return response()->json($item);
    }

    public function remove(CartItem $item): JsonResponse
    {
        $this->cartService->removeItem($item);
        return response()->json(['message' => 'Removed']);
    }

    public function merge(Request $request): JsonResponse
    {
        $request->validate(['session_id' => 'required|string']);
        $this->cartService->mergeGuestCart($request->session_id, auth()->id());
        return response()->json(['message' => 'Cart merged']);
    }
}
