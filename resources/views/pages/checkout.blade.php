@extends('layouts.app')

@section('content')
<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="section-title mb-8">Checkout</h1>

    <form action="{{ route('checkout.place') }}" method="POST" id="checkout-form" x-data="{ paymentMethod: 'razorpay', loading: false }">
        @csrf
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {{-- Left: Address + Payment --}}
            <div class="lg:col-span-3 space-y-6">

                {{-- Delivery Address --}}
                <div class="card p-6">
                    <h2 class="font-semibold text-lg text-gray-900 mb-4">Delivery Address</h2>
                    @auth
                    @if(auth()->user()->addresses->count())
                    <div class="space-y-3 mb-4">
                        @foreach(auth()->user()->addresses as $address)
                        <label class="flex gap-3 p-3 border-2 rounded-xl cursor-pointer transition-colors"
                            :class="'{{ $address->id }}' === selectedAddress ? 'border-primary-500 bg-primary-50' : 'border-gray-200'"
                            x-data="{ selectedAddress: '{{ auth()->user()->default_address_id }}' }">
                            <input type="radio" name="address_id" value="{{ $address->id }}" class="mt-1 text-primary-600"
                                {{ $address->is_default ? 'checked' : '' }}>
                            <div class="text-sm">
                                <p class="font-medium text-gray-900">{{ $address->name }} {{ $address->is_default ? '(Default)' : '' }}</p>
                                <p class="text-gray-500">{{ $address->line1 }}, {{ $address->city }}, {{ $address->state }} - {{ $address->pincode }}</p>
                                <p class="text-gray-500">📞 {{ $address->phone }}</p>
                            </div>
                        </label>
                        @endforeach
                    </div>
                    @endif
                    @endauth

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input type="text" name="name" value="{{ old('name', auth()->user()?->name) }}" required class="input-field" placeholder="John Doe"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input type="tel" name="phone" value="{{ old('phone') }}" required class="input-field" placeholder="+91 9999999999"></div>
                        <div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                            <input type="text" name="line1" value="{{ old('line1') }}" required class="input-field" placeholder="House/Flat No, Street"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input type="text" name="city" value="{{ old('city') }}" required class="input-field" placeholder="Mumbai"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">State</label>
                            <input type="text" name="state" value="{{ old('state') }}" required class="input-field" placeholder="Maharashtra"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                            <input type="text" name="pincode" value="{{ old('pincode') }}" required class="input-field" placeholder="400001" maxlength="6"></div>
                    </div>
                </div>

                {{-- Payment Method --}}
                <div class="card p-6">
                    <h2 class="font-semibold text-lg text-gray-900 mb-4">Payment Method</h2>
                    <div class="space-y-3">
                        @foreach([
                            ['razorpay','💳 Razorpay (Cards, UPI, Wallets)'],
                            ['stripe','💳 Stripe (International Cards)'],
                            ['cod','📦 Cash on Delivery'],
                        ] as [$value,$label])
                        <label class="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors"
                            :class="paymentMethod === '{{ $value }}' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'">
                            <input type="radio" name="payment_method" value="{{ $value }}" x-model="paymentMethod" class="text-primary-600">
                            <span class="font-medium text-gray-700">{{ $label }}</span>
                        </label>
                        @endforeach
                    </div>
                </div>
            </div>

            {{-- Right: Order Summary --}}
            <div class="lg:col-span-2">
                <div class="card p-6 sticky top-24">
                    <h2 class="font-semibold text-lg text-gray-900 mb-4">Order Summary</h2>
                    <div class="space-y-3 mb-4">
                        @foreach($cartItems as $item)
                        <div class="flex gap-3">
                            <img src="{{ $item->product->primary_image }}" alt="{{ $item->product->name }}"
                                class="w-14 h-18 object-cover rounded-lg flex-shrink-0" width="56" height="72">
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900 line-clamp-1">{{ $item->product->name }}</p>
                                <p class="text-xs text-gray-500">Qty: {{ $item->quantity }}</p>
                                <p class="text-sm font-semibold text-gray-900">₹{{ number_format($item->product->sale_price * $item->quantity) }}</p>
                            </div>
                        </div>
                        @endforeach
                    </div>
                    <div class="border-t border-gray-100 pt-4 space-y-2 text-sm">
                        <div class="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{{ number_format($subtotal) }}</span></div>
                        @if($discount > 0)
                        <div class="flex justify-between text-green-600"><span>Discount</span><span>-₹{{ number_format($discount) }}</span></div>
                        @endif
                        <div class="flex justify-between text-gray-600"><span>Shipping</span><span>{{ $shipping === 0 ? 'FREE' : '₹'.$shipping }}</span></div>
                        <div class="flex justify-between text-gray-600"><span>GST</span><span>₹{{ number_format($tax) }}</span></div>
                        <div class="flex justify-between font-bold text-gray-900 text-base border-t border-gray-100 pt-2">
                            <span>Total</span><span>₹{{ number_format($total) }}</span>
                        </div>
                    </div>

                    <button type="submit" class="btn-primary w-full mt-6 text-lg py-4" :disabled="loading"
                        @click="loading = true">
                        <span x-show="!loading">Place Order →</span>
                        <span x-show="loading" class="flex items-center justify-center gap-2">
                            <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                            Processing...
                        </span>
                    </button>
                    <p class="text-xs text-gray-400 text-center mt-3">🔒 Secured by SSL encryption</p>
                </div>
            </div>
        </div>
    </form>
</div>

@push('scripts')
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
<script>
document.getElementById('checkout-form').addEventListener('submit', async function(e) {
    const method = document.querySelector('[name=payment_method]:checked')?.value;
    if (method === 'razorpay') {
        e.preventDefault();
        const res = await axios.post('/checkout/razorpay/create-order', Object.fromEntries(new FormData(this)));
        const options = {
            key: '{{ config("services.razorpay.key") }}',
            amount: res.data.amount,
            currency: 'INR',
            order_id: res.data.order_id,
            name: '{{ config("app.name") }}',
            description: 'Fashion Purchase',
            handler: function(response) {
                axios.post('/checkout/razorpay/verify', response).then(r => window.location = r.data.redirect);
            },
            prefill: { name: document.querySelector('[name=name]').value, contact: document.querySelector('[name=phone]').value },
            theme: { color: '#db2777' }
        };
        new Razorpay(options).open();
    }
});
</script>
@endpush
@endsection
