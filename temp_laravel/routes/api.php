<?php

use App\Http\Controllers\SearchController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->middleware('throttle:api')->group(function () {
    Route::get('/search/suggest', [SearchController::class, 'suggest']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/user', fn(\Illuminate\Http\Request $r) => $r->user());
        Route::post('/cart/add', [\App\Http\Controllers\CartController::class, 'add']);
        Route::post('/wishlist/toggle', [\App\Http\Controllers\WishlistController::class, 'toggle']);
    });
});
