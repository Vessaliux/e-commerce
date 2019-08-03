<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class StripeController extends Controller
{
    public function createIntent(Request $request)
    {
        \Stripe\Stripe::setApiKey(env('STRIPE_TEST_SECRET_KEY'));

        if ($request->amount) {
            $amount = $request->amount;
        } else {
            $amount = 1099;
        }

        $intent = \Stripe\PaymentIntent::create([
            'amount' => $amount,
            'currency' => 'sgd',
        ]);

        return response()->json($intent->client_secret, 200);
    }
}
