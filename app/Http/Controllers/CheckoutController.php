<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Services\PaymentService;
use App\Services\InvoiceService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    public function __construct(
        private PaymentService $paymentService,
        private InvoiceService $invoiceService,
    ) {}

    public function index()
    {
        $cartItems = Cart::where('user_id', auth()->id())->with(['product.images', 'variant'])->get();

        if ($cartItems->isEmpty()) return redirect()->route('cart');

        [$subtotal, $discount, $shipping, $tax, $total] = $this->calcTotals($cartItems);

        return view('pages.checkout', compact('cartItems', 'subtotal', 'discount', 'shipping', 'tax', 'total'));
    }

    public function placeOrder(Request $request)
    {
        $request->validate([
            'name'           => 'required|string|max:100',
            'phone'          => 'required|string|max:20',
            'line1'          => 'required|string|max:255',
            'city'           => 'required|string|max:100',
            'state'          => 'required|string|max:100',
            'pincode'        => 'required|string|max:10',
            'payment_method' => 'required|in:razorpay,stripe,cod',
        ]);

        $cartItems = Cart::where('user_id', auth()->id())->with('product')->get();
        [$subtotal, $discount, $shipping, $tax, $total] = $this->calcTotals($cartItems);

        $order = DB::transaction(function () use ($request, $cartItems, $subtotal, $discount, $shipping, $tax, $total) {
            $order = Order::create([
                'user_id'          => auth()->id(),
                'status'           => 'pending',
                'payment_method'   => $request->payment_method,
                'payment_status'   => 'pending',
                'subtotal'         => $subtotal,
                'discount'         => $discount,
                'shipping'         => $shipping,
                'tax'              => $tax,
                'total'            => $total,
                'coupon_code'      => session('coupon_code'),
                'shipping_name'    => $request->name,
                'shipping_phone'   => $request->phone,
                'shipping_line1'   => $request->line1,
                'shipping_city'    => $request->city,
                'shipping_state'   => $request->state,
                'shipping_pincode' => $request->pincode,
            ]);

            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id'     => $order->id,
                    'product_id'   => $item->product_id,
                    'variant_id'   => $item->variant_id,
                    'product_name' => $item->product->name,
                    'price'        => $item->product->sale_price,
                    'quantity'     => $item->quantity,
                    'total'        => $item->product->sale_price * $item->quantity,
                ]);
            }

            return $order;
        });

        if ($request->payment_method === 'cod') {
            $this->finalizeOrder($order, $cartItems);
            return redirect()->route('order.success', $order->order_number);
        }

        return response()->json(['order_id' => $order->id, 'total' => $total]);
    }

    public function createRazorpayOrder(Request $request)
    {
        $order = Order::findOrFail($request->order_id);
        $razorpayOrder = $this->paymentService->createRazorpayOrder($order);
        return response()->json(['order_id' => $razorpayOrder->id, 'amount' => $razorpayOrder->amount]);
    }

    public function verifyRazorpay(Request $request)
    {
        $this->paymentService->verifyRazorpaySignature($request->all());

        $order = Order::where('id', session('pending_order_id'))->firstOrFail();
        $cartItems = Cart::where('user_id', auth()->id())->with('product')->get();

        Payment::create([
            'order_id'           => $order->id,
            'gateway'            => 'razorpay',
            'gateway_order_id'   => $request->razorpay_order_id,
            'gateway_payment_id' => $request->razorpay_payment_id,
            'amount'             => $order->total,
            'currency'           => 'INR',
            'status'             => 'paid',
        ]);

        $this->finalizeOrder($order, $cartItems);

        return response()->json(['redirect' => route('order.success', $order->order_number)]);
    }

    private function finalizeOrder(Order $order, $cartItems): void
    {
        $order->update(['status' => 'confirmed', 'payment_status' => 'paid']);
        Cart::where('user_id', auth()->id())->delete();
        session()->forget(['coupon_code', 'coupon_id']);
        $this->invoiceService->generate($order);
        // Dispatch order confirmation email
        // OrderConfirmed::dispatch($order);
    }

    private function calcTotals($cartItems): array
    {
        $subtotal = $cartItems->sum(fn($i) => $i->product->sale_price * $i->quantity);
        $discount = 0;
        $shipping = $subtotal >= 999 ? 0 : 99;
        $tax      = round($subtotal * 0.18, 2);
        $total    = $subtotal - $discount + $shipping + $tax;
        return [$subtotal, $discount, $shipping, $tax, $total];
    }
}
