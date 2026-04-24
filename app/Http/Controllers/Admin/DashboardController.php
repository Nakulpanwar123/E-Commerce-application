<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = Cache::remember('admin_dashboard_stats', 300, function () {
            $thisMonth = now()->startOfMonth();
            return [
                'revenue_today'   => Order::where('status', 'delivered')->whereDate('created_at', today())->sum('total'),
                'revenue_month'   => Order::where('status', 'delivered')->where('created_at', '>=', $thisMonth)->sum('total'),
                'orders_today'    => Order::whereDate('created_at', today())->count(),
                'orders_pending'  => Order::where('status', 'pending')->count(),
                'total_customers' => User::count(),
                'new_customers'   => User::where('created_at', '>=', $thisMonth)->count(),
                'total_products'  => Product::active()->count(),
                'low_stock'       => Product::where('stock', '<=', 5)->where('stock', '>', 0)->count(),
            ];
        });

        $revenueChart = Cache::remember('admin_revenue_chart', 3600, fn() =>
            Order::where('status', 'delivered')
                ->where('created_at', '>=', now()->subDays(30))
                ->selectRaw('DATE(created_at) as date, SUM(total) as revenue, COUNT(*) as orders')
                ->groupBy('date')->orderBy('date')->get()
        );

        $topProducts = Cache::remember('admin_top_products', 3600, fn() =>
            OrderItem::selectRaw('product_id, SUM(quantity) as sold, SUM(total) as revenue')
                ->with('product.images')
                ->groupBy('product_id')
                ->orderByDesc('revenue')
                ->take(5)->get()
        );

        $recentOrders = Order::with('user')->latest()->take(10)->get();

        return view('admin.dashboard', compact('stats', 'revenueChart', 'topProducts', 'recentOrders'));
    }
}
