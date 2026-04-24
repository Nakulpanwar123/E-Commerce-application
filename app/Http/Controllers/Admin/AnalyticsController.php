<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\Cache;

class AnalyticsController extends Controller
{
    public function index()
    {
        $data = Cache::remember('admin_analytics', 1800, function () {
            return [
                'revenue_by_month' => Order::where('status', 'delivered')
                    ->where('created_at', '>=', now()->subMonths(12))
                    ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, SUM(total) as revenue')
                    ->groupBy('month')->orderBy('month')->get(),

                'orders_by_status' => Order::selectRaw('status, COUNT(*) as count')
                    ->groupBy('status')->get()->pluck('count', 'status'),

                'top_categories' => \App\Models\OrderItem::join('products', 'order_items.product_id', '=', 'products.id')
                    ->join('categories', 'products.category_id', '=', 'categories.id')
                    ->selectRaw('categories.name, SUM(order_items.total) as revenue')
                    ->groupBy('categories.name')->orderByDesc('revenue')->take(5)->get(),

                'conversion_rate' => round(
                    Order::count() / max(User::count(), 1) * 100, 2
                ),

                'avg_order_value' => Order::where('status', 'delivered')->avg('total') ?? 0,
            ];
        });

        return view('admin.analytics', $data);
    }
}
