<footer class="bg-gray-900 text-gray-300 mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            {{-- Brand --}}
            <div>
                <a href="{{ route('home') }}" class="font-display text-2xl font-bold text-white">FashionStore</a>
                <p class="mt-3 text-sm text-gray-400 leading-relaxed">Your destination for premium fashion. Curated styles for every occasion.</p>
                <div class="flex gap-4 mt-4">
                    @foreach([['Instagram','M12 2.163c3.204 0 3.584.012 4.85.07...'],['Facebook','M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z']] as [$name,$path])
                    <a href="#" class="text-gray-400 hover:text-white transition-colors" aria-label="{{ $name }}">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="{{ $path }}"/></svg>
                    </a>
                    @endforeach
                </div>
            </div>

            {{-- Shop --}}
            <div>
                <h3 class="text-white font-semibold mb-4">Shop</h3>
                <ul class="space-y-2 text-sm">
                    @foreach([['Men','men'],['Women','women'],['Kids','kids'],['Sale','sale'],['New Arrivals','new-arrivals']] as [$label,$slug])
                    <li><a href="{{ route('category', $slug) }}" class="hover:text-white transition-colors">{{ $label }}</a></li>
                    @endforeach
                </ul>
            </div>

            {{-- Help --}}
            <div>
                <h3 class="text-white font-semibold mb-4">Help</h3>
                <ul class="space-y-2 text-sm">
                    @foreach([['Track Order','/orders/track'],['Returns & Refunds','/returns'],['Size Guide','/size-guide'],['Contact Us','/contact'],['FAQ','/faq']] as [$label,$url])
                    <li><a href="{{ $url }}" class="hover:text-white transition-colors">{{ $label }}</a></li>
                    @endforeach
                </ul>
            </div>

            {{-- Newsletter --}}
            <div>
                <h3 class="text-white font-semibold mb-4">Stay in Style</h3>
                <p class="text-sm text-gray-400 mb-3">Get the latest trends and exclusive offers.</p>
                <form action="{{ route('newsletter.subscribe') }}" method="POST" class="flex gap-2">
                    @csrf
                    <input type="email" name="email" placeholder="Your email" required
                        class="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <button type="submit" class="btn-primary text-sm py-2 px-4">Join</button>
                </form>
            </div>
        </div>

        <div class="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© {{ date('Y') }} FashionStore. All rights reserved.</p>
            <div class="flex gap-6">
                <a href="/privacy-policy" class="hover:text-white transition-colors">Privacy Policy</a>
                <a href="/terms" class="hover:text-white transition-colors">Terms of Service</a>
            </div>
            <div class="flex items-center gap-2">
                <img src="{{ asset('images/payments/visa.svg') }}" alt="Visa" class="h-6">
                <img src="{{ asset('images/payments/mastercard.svg') }}" alt="Mastercard" class="h-6">
                <img src="{{ asset('images/payments/razorpay.svg') }}" alt="Razorpay" class="h-6">
                <img src="{{ asset('images/payments/upi.svg') }}" alt="UPI" class="h-6">
            </div>
        </div>
    </div>
</footer>
