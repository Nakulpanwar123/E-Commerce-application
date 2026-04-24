<header class="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm" x-data="{ mobileOpen: false }">

    {{-- Promo Bar --}}
    <div class="bg-primary-600 text-white text-center text-sm py-2 px-4">
        🚚 Free shipping on orders over ₹999 &nbsp;|&nbsp; Use code <strong>FASHION20</strong> for 20% off
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">

            {{-- Logo --}}
            <a href="{{ route('home') }}" class="font-display text-2xl font-bold text-primary-600">FashionStore</a>

            {{-- Desktop Nav --}}
            <nav class="hidden lg:flex items-center gap-8" aria-label="Main navigation">
                @foreach([['Men','men'],['Women','women'],['Kids','kids']] as [$label,$slug])
                <a href="{{ route('category', $slug) }}" class="nav-link">{{ $label }}</a>
                @endforeach
                <a href="{{ route('sale') }}" class="nav-link text-red-500 font-semibold">Sale 🔥</a>
                <a href="{{ route('blog.index') }}" class="nav-link">Blog</a>
            </nav>

            {{-- Search --}}
            <div class="hidden md:flex flex-1 max-w-sm mx-8" x-data="search()">
                <div class="relative w-full">
                    <input type="search" placeholder="Search clothes, brands..."
                        class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
                        x-model="query" @input="fetch()" @focus="open = query.length > 1" @click.away="open = false">
                    <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <div x-show="open && results.length" class="absolute top-full left-0 right-0 bg-white shadow-xl rounded-xl border border-gray-100 mt-1 z-50" style="display:none">
                        <template x-for="item in results" :key="item.id">
                            <a :href="item.url" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                                <img :src="item.image" :alt="item.name" class="w-10 h-10 object-cover rounded-lg">
                                <div>
                                    <p class="text-sm font-medium" x-text="item.name"></p>
                                    <p class="text-xs text-primary-600 font-semibold" x-text="'₹' + item.price"></p>
                                </div>
                            </a>
                        </template>
                    </div>
                </div>
            </div>

            {{-- Icons --}}
            <div class="flex items-center gap-2">
                <a href="{{ route('wishlist') }}" class="btn-ghost" aria-label="Wishlist">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                </a>
                <a href="{{ route('cart') }}" class="btn-ghost relative" aria-label="Cart">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 7H4l1-7z"/></svg>
                    <span class="absolute -top-1 -right-1 bg-primary-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold"
                        x-text="$store.cart.count" x-show="$store.cart.count > 0"></span>
                </a>
                @auth
                <div class="relative group">
                    <button class="btn-ghost"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg></button>
                    <div class="absolute right-0 top-full w-48 bg-white shadow-xl rounded-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 mt-1">
                        <a href="{{ route('dashboard') }}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Orders</a>
                        <a href="{{ route('profile') }}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</a>
                        @if(auth()->user()->hasRole('admin'))
                        <a href="{{ route('admin.dashboard') }}" class="block px-4 py-2 text-sm text-primary-600 font-medium hover:bg-gray-50">Admin Panel</a>
                        @endif
                        <hr class="my-1">
                        <form method="POST" action="{{ route('logout') }}">@csrf
                            <button type="submit" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">Logout</button>
                        </form>
                    </div>
                </div>
                @else
                <a href="{{ route('login') }}" class="btn-primary text-sm py-2 px-4">Login</a>
                @endauth
                <button class="lg:hidden btn-ghost" @click="mobileOpen = !mobileOpen">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                </button>
            </div>
        </div>
    </div>

    {{-- Mobile Menu --}}
    <div x-show="mobileOpen" x-transition class="lg:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-2" style="display:none">
        <a href="{{ route('category', 'men') }}" class="block py-2 font-medium">Men</a>
        <a href="{{ route('category', 'women') }}" class="block py-2 font-medium">Women</a>
        <a href="{{ route('category', 'kids') }}" class="block py-2 font-medium">Kids</a>
        <a href="{{ route('sale') }}" class="block py-2 text-red-500 font-semibold">Sale 🔥</a>
        <a href="{{ route('blog.index') }}" class="block py-2 font-medium">Blog</a>
    </div>
</header>
