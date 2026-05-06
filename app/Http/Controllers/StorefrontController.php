<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class StorefrontController extends Controller
{
    public function __invoke(Request $request)
    {
        return view('storefront', [
            'seo' => [
                'title' => 'FashionStore',
                'description' => 'Modern fashion e-commerce storefront built with Laravel, Vite, and React.',
                'canonical' => $request->fullUrl(),
            ],
        ]);
    }
}
