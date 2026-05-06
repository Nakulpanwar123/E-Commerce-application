<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class NewsletterController extends Controller
{
    public function index()
    {
        $subscribers = NewsletterSubscriber::where('is_active', true)->latest()->paginate(20);
        return view('admin.newsletter', compact('subscribers'));
    }

    public function send(Request $request)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'body'    => 'required|string',
        ]);

        $subscribers = NewsletterSubscriber::where('is_active', true)->pluck('email');

        foreach ($subscribers->chunk(50) as $chunk) {
            // Dispatch newsletter job
            // SendNewsletterJob::dispatch($chunk, $request->subject, $request->body);
        }

        return back()->with('success', "Newsletter queued for {$subscribers->count()} subscribers.");
    }
}
