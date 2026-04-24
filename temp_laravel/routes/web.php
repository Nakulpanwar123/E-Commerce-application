<?php

use App\Http\Controllers\BlogController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\UserDashboardController;
use App\Http\Controllers\OutfitBuilderController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboard;
use App\Http\Controllers\Admin\ProductController as AdminProduct;
use App\Http\Controllers\Admin\OrderController as AdminOrder;
use App\Http\Controllers\Admin\CategoryController as AdminCategory;
use App\Http\Controllers\Admin\CouponController as AdminCoupon;
use App\Http\Controllers\Admin\BlogController as AdminBlog;
use App\Http\Controllers\Admin\UserController as AdminUser;
use App\Http\Controllers\Admin\AnalyticsController as AdminAnalytics;
use App\Http\Controllers\Admin\NewsletterController as AdminNewsletter;
use Illuminate\Support\Facades\Route;

// ── Public ──────────────────────────────────────────────────────────────────
Route::get('/', [HomeController::class, 'index'])->name('home');

// Auth
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.post');
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register'])->name('register.post');
    Route::get('/auth/google', [AuthController::class, 'redirectToGoogle'])->name('auth.google');
    Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);
});
Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

// Search
Route::get('/search', [SearchController::class, 'index'])->name('search');
Route::get('/search/suggest', [SearchController::class, 'suggest'])->name('search.suggest');

// Static pages
Route::get('/size-guide', fn() => view('pages.size-guide'))->name('size-guide');

// Sale
Route::get('/sale', [CategoryController::class, 'sale'])->name('sale');

// Blog
Route::prefix('blog')->name('blog.')->group(function () {
    Route::get('/', [BlogController::class, 'index'])->name('index');
    Route::get('/{slug}', [BlogController::class, 'show'])->name('show');
});

// Cart (guest + auth)
Route::prefix('cart')->group(function () {
    Route::get('/', [CartController::class, 'index'])->name('cart');
    Route::post('/add', [CartController::class, 'add'])->name('cart.add');
    Route::patch('/{cart}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/{cart}', [CartController::class, 'destroy'])->name('cart.destroy');
    Route::post('/coupon', [CartController::class, 'applyCoupon'])->name('coupon.apply');
});

// Newsletter
Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe'])->name('newsletter.subscribe');

// SEO
Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');
Route::get('/robots.txt', fn() => response(view('seo.robots'), 200, ['Content-Type' => 'text/plain']));

// Product (must come before category catch-all)
Route::get('/p/{slug}', [ProductController::class, 'show'])->name('product.show');

// Category catch-all (SEO-friendly URLs)
Route::get('/{slug}', [CategoryController::class, 'show'])->name('category')
    ->where('slug', 'men|women|kids|new-arrivals|trending|men/.+|women/.+|kids/.+');

// ── Authenticated ────────────────────────────────────────────────────────────
Route::middleware('auth')->group(function () {

    // Checkout
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout');
    Route::post('/checkout/place', [CheckoutController::class, 'placeOrder'])->name('checkout.place');
    Route::post('/checkout/razorpay/create-order', [CheckoutController::class, 'createRazorpayOrder'])->name('checkout.razorpay.create');
    Route::post('/checkout/razorpay/verify', [CheckoutController::class, 'verifyRazorpay'])->name('checkout.razorpay.verify');
    Route::get('/order/success/{orderNumber}', fn($n) => view('pages.order-success', ['orderNumber' => $n]))->name('order.success');

    // Wishlist
    Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist');
    Route::post('/wishlist/toggle', [WishlistController::class, 'toggle'])->name('wishlist.toggle');

    // Dashboard
    Route::prefix('dashboard')->group(function () {
        Route::get('/', [UserDashboardController::class, 'index'])->name('dashboard');
        Route::get('/orders', [UserDashboardController::class, 'orders'])->name('dashboard.orders');
        Route::get('/orders/{order}', [UserDashboardController::class, 'orderDetail'])->name('dashboard.order.detail');
        Route::get('/orders/{order}/invoice', [UserDashboardController::class, 'downloadInvoice'])->name('dashboard.invoice');
        Route::post('/orders/{order}/review', [UserDashboardController::class, 'submitReview'])->name('dashboard.review');
    });

    Route::get('/profile', [UserDashboardController::class, 'profile'])->name('profile');
    Route::patch('/profile', [UserDashboardController::class, 'updateProfile'])->name('profile.update');

    // Outfit Builder
    Route::get('/outfit-builder', [OutfitBuilderController::class, 'index'])->name('outfit-builder');
    Route::post('/outfit/save', [OutfitBuilderController::class, 'save'])->name('outfit.save');
});

// ── Admin ────────────────────────────────────────────────────────────────────
Route::prefix('admin')->name('admin.')->middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/', [AdminDashboard::class, 'index'])->name('dashboard');

    Route::resource('products', AdminProduct::class);
    Route::post('products/bulk-upload', [AdminProduct::class, 'bulkUpload'])->name('products.bulk-upload');

    Route::resource('orders', AdminOrder::class)->only(['index', 'show']);
    Route::patch('orders/{order}/status', [AdminOrder::class, 'updateStatus'])->name('orders.status');

    Route::resource('categories', AdminCategory::class);
    Route::resource('coupons', AdminCoupon::class);
    Route::resource('blogs', AdminBlog::class);
    Route::resource('users', AdminUser::class)->only(['index', 'show', 'destroy']);

    Route::get('analytics', [AdminAnalytics::class, 'index'])->name('analytics');
    Route::get('newsletter', [AdminNewsletter::class, 'index'])->name('newsletter');
    Route::post('newsletter/send', [AdminNewsletter::class, 'send'])->name('newsletter.send');
});
