<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        \App\Models\NewsletterSubscriber::firstOrCreate(['email' => $request->email]);

        return back()->with('success', 'You have been subscribed!');
    }
}
