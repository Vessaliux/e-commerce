<?php

namespace App\Http\Controllers;

use Auth;
use App\Cart;
use App\CartItem;
use App\User;
use Illuminate\Http\Request;

class StripeController extends Controller
{
    public function charge(Request $request)
    {
        $user = Auth::user();

        // get user's cart
        $cart = $user->carts()->where('checked_out', '=', false);

        // if cart doesn't exist, invalid transaction
        if (!$cart->exists()) {
            return response()->json(['error' => 'Cart does not exist'], 404);
        } else {
            $cart = $cart->get()->first();
        }

        // get all cart items
        $cartItems = CartItem::with(['product'])->where('cart_id', '=', $cart->id)->get();

        // check if cart is empty
        if (count($cartItems) === 0) {
            return response()->json(["error" => 'There are no items in the cart'], 400);
        }

        // calculate total
        $amount = 0;
        foreach ($cartItems as $item) {
            $amount += $item->price * $item->quantity;

            // final quantity check
            if ($item->quantity > $item->product->units) {
                return response()->json(["error" => 'Out of stock'], 400);
            } else {
                $item->product->units -= $item->quantity;
                $item->product->save();
            }
        }

        // ex. $11.55 = 1155 according to Stripe API
        $amount *= 100;

        // retrieve token
        $token = file_get_contents('php://input');

        \Stripe\Stripe::setApiKey(env('STRIPE_TEST_SECRET_KEY'));
        $charge = \Stripe\Charge::create([
            'amount' => $amount,
            'currency' => 'sgd',
            'source' => $token,
            'statement_descriptor' => 'E-Commerce'
        ]);

        // if payment is successful, mark cart as deleted
        if ($charge) {
            $cart->delete();
        } else {
            return response()->json(["error" => "Payment error"], 400);
        }

        return response()->json($charge, 200);
    }
}
