<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\OrderService;
use App\Services\PaymentService;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct(
        private OrderService $orderService,
        private PaymentService $paymentService
    ) {}

    public function index(): JsonResponse
    {
        $orders = auth()->user()->orders()->with('items')->latest()->paginate(10);
        return response()->json($orders);
    }

    public function show(Order $order): JsonResponse
    {
        $this->authorize('view', $order);
        return response()->json($order->load(['items.product', 'payment']));
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'shipping_address'         => 'required|array',
            'shipping_address.full_name' => 'required|string',
            'shipping_address.phone'   => 'required|string',
            'shipping_address.address_line1' => 'required|string',
            'shipping_address.city'    => 'required|string',
            'shipping_address.state'   => 'required|string',
            'shipping_address.pincode' => 'required|string',
            'payment_method'           => 'required|in:razorpay,stripe,cod',
            'coupon_code'              => 'nullable|string',
        ]);

        $cart  = auth()->user()->cart;
        $order = $this->orderService->createFromCart($cart, $request->all());

        $paymentData = null;
        if ($request->payment_method === 'razorpay') {
            $paymentData = $this->paymentService->createRazorpayOrder($order);
        } elseif ($request->payment_method === 'cod') {
            $this->paymentService->handleCOD($order);
        }

        return response()->json(compact('order', 'paymentData'), 201);
    }

    public function verifyPayment(Request $request): JsonResponse
    {
        $request->validate([
            'razorpay_order_id'   => 'required',
            'razorpay_payment_id' => 'required',
            'razorpay_signature'  => 'required',
        ]);

        $success = $this->paymentService->verifyRazorpay($request->all());
        return response()->json(['success' => $success], $success ? 200 : 400);
    }

    // Admin
    public function adminIndex(Request $request): JsonResponse
    {
        $orders = Order::with(['user', 'items'])
            ->when($request->status, fn($q, $v) => $q->where('status', $v))
            ->latest()
            ->paginate(20);
        return response()->json($orders);
    }

    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $request->validate(['status' => 'required|in:pending,confirmed,processing,shipped,delivered,cancelled,refunded']);
        $order = $this->orderService->updateStatus($order, $request->status);
        return response()->json($order);
    }

    public function stats(): JsonResponse
    {
        return response()->json($this->orderService->getAdminStats());
    }
}
