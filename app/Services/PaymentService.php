<?php

namespace App\Services;

use App\Models\Order;
use Razorpay\Api\Api;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    private Api $razorpay;

    public function __construct()
    {
        $this->razorpay = new Api(
            config('services.razorpay.key'),
            config('services.razorpay.secret')
        );
    }

    public function createRazorpayOrder(Order $order): object
    {
        return $this->razorpay->order->create([
            'amount'          => (int) ($order->total * 100), // paise
            'currency'        => 'INR',
            'receipt'         => $order->order_number,
            'payment_capture' => 1,
        ]);
    }

    public function verifyRazorpaySignature(array $data): void
    {
        $generated = hash_hmac(
            'sha256',
            $data['razorpay_order_id'] . '|' . $data['razorpay_payment_id'],
            config('services.razorpay.secret')
        );

        if ($generated !== $data['razorpay_signature']) {
            Log::error('Razorpay signature mismatch', $data);
            abort(400, 'Payment verification failed.');
        }
    }

    public function createStripeIntent(Order $order): string
    {
        \Stripe\Stripe::setApiKey(config('services.stripe.secret'));

        $intent = \Stripe\PaymentIntent::create([
            'amount'   => (int) ($order->total * 100),
            'currency' => 'inr',
            'metadata' => ['order_number' => $order->order_number],
        ]);

        return $intent->client_secret;
    }
}
