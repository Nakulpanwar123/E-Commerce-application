<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class HomeController extends Controller
{
    public function index(): JsonResponse
    {
        $data = Cache::remember('home:data', 1800, function () {
            return [
                'banners'    => Banner::active()->where('position', 'hero')->get(),
                'featured'   => Product::with(['category','brand'])->active()->featured()->limit(8)->get(),
                'trending'   => Product::with(['category','brand'])->active()->trending()->limit(8)->get(),
                'categories' => Category::with('children')->active()->root()->orderBy('sort_order')->get(),
                'new_arrivals' => Product::with(['category','brand'])->active()->latest()->limit(8)->get(),
                'mid_banners'  => Banner::active()->where('position', 'mid')->get(),
            ];
        });

        return response()->json($data);
    }
}
