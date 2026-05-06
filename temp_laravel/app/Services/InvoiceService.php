<?php

namespace App\Services;

use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class InvoiceService
{
    public function generate(Order $order): string
    {
        $order->load(['items.product', 'user']);

        $pdf = Pdf::loadView('pdf.invoice', compact('order'))
            ->setPaper('a4')
            ->setOptions(['dpi' => 150, 'defaultFont' => 'sans-serif']);

        $path = "invoices/INV-{$order->order_number}.pdf";
        Storage::disk('s3')->put($path, $pdf->output());

        return $path;
    }

    public function download(Order $order)
    {
        $order->load(['items.product', 'user']);

        return Pdf::loadView('pdf.invoice', compact('order'))
            ->setPaper('a4')
            ->download("INV-{$order->order_number}.pdf");
    }
}
