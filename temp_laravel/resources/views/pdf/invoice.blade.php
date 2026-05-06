<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Invoice {{ $order->order_number }}</title>
    <style>
        body { font-family: sans-serif; font-size: 13px; color: #333; margin: 0; padding: 30px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .brand { font-size: 24px; font-weight: bold; color: #db2777; }
        h2 { font-size: 16px; margin-bottom: 8px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #f9fafb; padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; color: #6b7280; border-bottom: 1px solid #e5e7eb; }
        td { padding: 10px 12px; border-bottom: 1px solid #f3f4f6; }
        .totals { margin-top: 20px; margin-left: auto; width: 250px; }
        .totals tr td:first-child { color: #6b7280; }
        .totals tr:last-child td { font-weight: bold; font-size: 15px; border-top: 2px solid #e5e7eb; padding-top: 8px; }
        .footer { margin-top: 40px; text-align: center; color: #9ca3af; font-size: 11px; }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <div class="brand">FashionStore</div>
            <p style="color:#6b7280;margin:4px 0">fashionstore.com</p>
        </div>
        <div style="text-align:right">
            <h2>INVOICE</h2>
            <p style="margin:2px 0"><strong>{{ $order->order_number }}</strong></p>
            <p style="margin:2px 0;color:#6b7280">{{ $order->created_at->format('M d, Y') }}</p>
        </div>
    </div>

    <div style="display:flex;gap:40px;margin-bottom:20px">
        <div>
            <h2>Bill To</h2>
            <p style="margin:2px 0">{{ $order->user->name }}</p>
            <p style="margin:2px 0;color:#6b7280">{{ $order->user->email }}</p>
        </div>
        <div>
            <h2>Ship To</h2>
            <p style="margin:2px 0">{{ $order->shipping_name }}</p>
            <p style="margin:2px 0;color:#6b7280">{{ $order->shipping_line1 }}, {{ $order->shipping_city }}</p>
            <p style="margin:2px 0;color:#6b7280">{{ $order->shipping_state }} - {{ $order->shipping_pincode }}</p>
        </div>
    </div>

    <table>
        <thead><tr>
            <th>Product</th><th>Qty</th><th>Unit Price</th><th>Total</th>
        </tr></thead>
        <tbody>
            @foreach($order->items as $item)
            <tr>
                <td>{{ $item->product_name }}@if($item->variant_name) <span style="color:#9ca3af">({{ $item->variant_name }})</span>@endif</td>
                <td>{{ $item->quantity }}</td>
                <td>₹{{ number_format($item->price, 2) }}</td>
                <td>₹{{ number_format($item->total, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <table class="totals">
        <tr><td>Subtotal</td><td style="text-align:right">₹{{ number_format($order->subtotal, 2) }}</td></tr>
        @if($order->discount > 0)
        <tr><td>Discount</td><td style="text-align:right;color:#16a34a">-₹{{ number_format($order->discount, 2) }}</td></tr>
        @endif
        <tr><td>Shipping</td><td style="text-align:right">{{ $order->shipping == 0 ? 'FREE' : '₹'.number_format($order->shipping, 2) }}</td></tr>
        <tr><td>GST (18%)</td><td style="text-align:right">₹{{ number_format($order->tax, 2) }}</td></tr>
        <tr><td>Total</td><td style="text-align:right">₹{{ number_format($order->total, 2) }}</td></tr>
    </table>

    <div class="footer">
        <p>Thank you for shopping with FashionStore! For support: support@fashionstore.com</p>
    </div>
</body>
</html>
