<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;

class CartService
{
    public function getOrCreate(?int $userId, ?string $sessionId): Cart
    {
        if ($userId) {
            return Cart::firstOrCreate(['user_id' => $userId]);
        }
        return Cart::firstOrCreate(['session_id' => $sessionId]);
    }

    public function addItem(Cart $cart, int $productId, int $quantity, ?int $variantId = null): CartItem
    {
        $product = Product::findOrFail($productId);
        $stock = $variantId
            ? ProductVariant::findOrFail($variantId)->stock
            : $product->stock;

        $existing = CartItem::where(['cart_id' => $cart->id, 'product_id' => $productId, 'variant_id' => $variantId])->first();

        if ($existing) {
            $newQty = min($existing->quantity + $quantity, $stock);
            $existing->update(['quantity' => $newQty]);
            return $existing;
        }

        return CartItem::create([
            'cart_id'    => $cart->id,
            'product_id' => $productId,
            'variant_id' => $variantId,
            'quantity'   => min($quantity, $stock),
        ]);
    }

    public function updateItem(CartItem $item, int $quantity): CartItem
    {
        $item->update(['quantity' => max(1, $quantity)]);
        return $item;
    }

    public function removeItem(CartItem $item): void
    {
        $item->delete();
    }

    public function mergeGuestCart(string $sessionId, int $userId): void
    {
        $guestCart = Cart::where('session_id', $sessionId)->with('items')->first();
        if (!$guestCart) return;

        $userCart = Cart::firstOrCreate(['user_id' => $userId]);

        foreach ($guestCart->items as $item) {
            $this->addItem($userCart, $item->product_id, $item->quantity, $item->variant_id);
        }

        $guestCart->delete();
    }

    public function getCartWithItems(Cart $cart): Cart
    {
        return $cart->load(['items.product.category', 'items.variant']);
    }
}
