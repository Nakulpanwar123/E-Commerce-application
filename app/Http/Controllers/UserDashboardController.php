<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Review;
use App\Services\InvoiceService;
use Illuminate\Http\Request;

class UserDashboardController extends Controller
{
    public function __construct(private InvoiceService $invoiceService) {}

    public function index()
    {
        $user = auth()->user();
        $recentOrders = Order::where('user_id', $user->id)->with('items.product.images')->latest()->take(5)->get();
        return view('pages.dashboard.index', compact('user', 'recentOrders'));
    }

    public function orders()
    {
        $orders = Order::where('user_id', auth()->id())->with('items')->latest()->paginate(10);
        return view('pages.dashboard.orders', compact('orders'));
    }

    public function orderDetail(Order $order)
    {
        abort_if($order->user_id !== auth()->id(), 403);
        $order->load(['items.product.images', 'payment']);
        return view('pages.dashboard.order-detail', compact('order'));
    }

    public function downloadInvoice(Order $order)
    {
        abort_if($order->user_id !== auth()->id(), 403);
        return $this->invoiceService->download($order);
    }

    public function submitReview(Request $request, Order $order)
    {
        abort_if($order->user_id !== auth()->id(), 403);

        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating'     => 'required|integer|min:1|max:5',
            'title'      => 'nullable|string|max:100',
            'body'       => 'required|string|max:1000',
        ]);

        Review::updateOrCreate(
            ['product_id' => $data['product_id'], 'user_id' => auth()->id()],
            array_merge($data, ['is_approved' => false])
        );

        return back()->with('success', 'Review submitted for approval.');
    }

    public function profile()
    {
        $user = auth()->user()->load('addresses');
        return view('pages.dashboard.profile', compact('user'));
    }

    public function updateProfile(Request $request)
    {
        $data = $request->validate([
            'name'  => 'required|string|max:100',
            'phone' => 'nullable|string|max:20',
            'email' => 'required|email|unique:users,email,' . auth()->id(),
        ]);

        auth()->user()->update($data);
        return back()->with('success', 'Profile updated.');
    }
}
