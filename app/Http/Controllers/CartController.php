<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Coupon;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index()
    {
        $cartItems = $this->getCartItems();
        [$subtotal, $discount, $shipping, $tax, $total] = $this->calculateTotals($cartItems);

        return view('pages.cart', compact('cartItems', 'subtotal', 'discount', 'shipping', 'tax', 'total'));
    }

    public function add(Request $request)
    {
        $request->validate(['product_id' => 'required|exists:products,id', 'quantity' => 'integer|min:1|max:10']);

        $key = ['product_id' => $request->product_id, 'variant_id' => $request->variant_id];
        $identifier = $this->identifier();

        $item = Cart::where($identifier)->where($key)->first();

        if ($item) {
            $item->increment('quantity', $request->quantity ?? 1);
        } else {
            Cart::create(array_merge($identifier, $key, ['quantity' => $request->quantity ?? 1]));
        }

        return response()->json(['cart_count' => Cart::where($identifier)->sum('quantity')]);
    }

    public function update(Request $request, Cart $cart)
    {
        $this->authorizeCart($cart);
        $cart->update(['quantity' => $request->validate(['quantity' => 'required|integer|min:1|max:10'])['quantity']]);
        return response()->json(['success' => true]);
    }

    public function destroy(Cart $cart)
    {
        $this->authorizeCart($cart);
        $cart->delete();
        $count = Cart::where($this->identifier())->sum('quantity');
        return response()->json(['cart_count' => $count]);
    }

    public function applyCoupon(Request $request)
    {
        $coupon = Coupon::where('code', strtoupper($request->code))->first();

        if (!$coupon || !$coupon->isValid()) {
            return back()->with('coupon_error', 'Invalid or expired coupon code.');
        }

        session(['coupon_code' => $coupon->code, 'coupon_id' => $coupon->id]);
        return back()->with('coupon_success', "Coupon applied! You save ₹{$coupon->value}");
    }

    private function getCartItems()
    {
        return Cart::where($this->identifier())->with(['product.images', 'variant'])->get();
    }

    private function calculateTotals($cartItems): array
    {
        $subtotal = $cartItems->sum(fn($i) => $i->product->sale_price * $i->quantity);
        $discount = 0;

        if ($couponId = session('coupon_id')) {
            $coupon = Coupon::find($couponId);
            $discount = $coupon?->calculateDiscount($subtotal) ?? 0;
        }

        $shipping = ($subtotal - $discount) >= 999 ? 0 : 99;
        $tax      = round(($subtotal - $discount) * 0.18, 2);
        $total    = $subtotal - $discount + $shipping + $tax;

        return [$subtotal, $discount, $shipping, $tax, $total];
    }

    private function identifier(): array
    {
        return auth()->check()
            ? ['user_id' => auth()->id()]
            : ['session_id' => session()->getId()];
    }

    private function authorizeCart(Cart $cart): void
    {
        $id = $this->identifier();
        abort_if(
            (isset($id['user_id']) && $cart->user_id !== $id['user_id']) ||
            (isset($id['session_id']) && $cart->session_id !== $id['session_id']),
            403
        );
    }
}
