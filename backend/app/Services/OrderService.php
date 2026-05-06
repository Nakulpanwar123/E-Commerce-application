<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use App\Jobs\SendOrderConfirmationEmail;

class OrderService
{
    public function createFromCart(Cart $cart, array $data): Order
    {
        return DB::transaction(function () use ($cart, $data) {
            $cart->load('items.product.variants');
            $items = $cart->items;

            if ($items->isEmpty()) {
                throw new \Exception('Cart is empty');
            }

            $subtotal = $items->sum(fn($i) => $i->product->effective_price * $i->quantity);
            $discount = 0;
            $coupon   = null;

            if (!empty($data['coupon_code'])) {
                $coupon = Coupon::where('code', $data['coupon_code'])->first();
                if ($coupon && $coupon->isValid($subtotal)) {
                    $discount = $coupon->calculateDiscount($subtotal);
                    $coupon->increment('used_count');
                }
            }

            $shipping = $subtotal >= 999 ? 0 : 99;
            $tax      = round(($subtotal - $discount) * 0.18, 2);
            $total    = $subtotal - $discount + $shipping + $tax;

            $order = Order::create([
                'order_number'    => Order::generateOrderNumber(),
                'user_id'         => $cart->user_id,
                'coupon_id'       => $coupon?->id,
                'shipping_address'=> $data['shipping_address'],
                'subtotal'        => $subtotal,
                'discount'        => $discount,
                'shipping_charge' => $shipping,
                'tax'             => $tax,
                'total'           => $total,
                'payment_method'  => $data['payment_method'],
                'notes'           => $data['notes'] ?? null,
            ]);

            foreach ($items as $item) {
                OrderItem::create([
                    'order_id'     => $order->id,
                    'product_id'   => $item->product_id,
                    'variant_id'   => $item->variant_id,
                    'product_name' => $item->product->name,
                    'variant_info' => $item->variant ? "{$item->variant->size} / {$item->variant->color}" : null,
                    'quantity'     => $item->quantity,
                    'price'        => $item->product->effective_price,
                    'total'        => $item->product->effective_price * $item->quantity,
                ]);

                // Decrement stock
                if ($item->variant_id) {
                    $item->variant->decrement('stock', $item->quantity);
                } else {
                    $item->product->decrement('stock', $item->quantity);
                }
            }

            $cart->items()->delete();
            SendOrderConfirmationEmail::dispatch($order);

            return $order->load('items');
        });
    }

    public function updateStatus(Order $order, string $status): Order
    {
        $order->update(['status' => $status]);
        return $order;
    }

    public function getAdminStats(): array
    {
        return [
            'total_orders'   => Order::count(),
            'total_revenue'  => Order::where('payment_status', 'paid')->sum('total'),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'today_orders'   => Order::whereDate('created_at', today())->count(),
            'today_revenue'  => Order::whereDate('created_at', today())->where('payment_status', 'paid')->sum('total'),
        ];
    }
}
