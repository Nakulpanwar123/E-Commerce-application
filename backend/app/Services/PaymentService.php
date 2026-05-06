<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    public function createRazorpayOrder(Order $order): array
    {
        $api = new \Razorpay\Api\Api(config('services.razorpay.key'), config('services.razorpay.secret'));

        $razorpayOrder = $api->order->create([
            'amount'   => (int)($order->total * 100),
            'currency' => 'INR',
            'receipt'  => $order->order_number,
        ]);

        Payment::create([
            'order_id'         => $order->id,
            'gateway'          => 'razorpay',
            'gateway_order_id' => $razorpayOrder->id,
            'amount'           => $order->total,
            'currency'         => 'INR',
        ]);

        return [
            'gateway_order_id' => $razorpayOrder->id,
            'amount'           => (int)($order->total * 100),
            'currency'         => 'INR',
            'key'              => config('services.razorpay.key'),
        ];
    }

    public function verifyRazorpay(array $data): bool
    {
        $api = new \Razorpay\Api\Api(config('services.razorpay.key'), config('services.razorpay.secret'));

        try {
            $api->utility->verifyPaymentSignature([
                'razorpay_order_id'   => $data['razorpay_order_id'],
                'razorpay_payment_id' => $data['razorpay_payment_id'],
                'razorpay_signature'  => $data['razorpay_signature'],
            ]);

            $payment = Payment::where('gateway_order_id', $data['razorpay_order_id'])->firstOrFail();
            $payment->update([
                'gateway_payment_id' => $data['razorpay_payment_id'],
                'gateway_signature'  => $data['razorpay_signature'],
                'status'             => 'success',
                'gateway_response'   => $data,
            ]);

            $payment->order->update(['payment_status' => 'paid', 'status' => 'confirmed']);
            return true;
        } catch (\Exception $e) {
            Log::error('Razorpay verification failed: ' . $e->getMessage());
            return false;
        }
    }

    public function handleCOD(Order $order): void
    {
        Payment::create([
            'order_id' => $order->id,
            'gateway'  => 'cod',
            'amount'   => $order->total,
            'currency' => 'INR',
            'status'   => 'pending',
        ]);
        $order->update(['status' => 'confirmed']);
    }
}
