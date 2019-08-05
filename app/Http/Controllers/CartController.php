<?php

namespace App\Http\Controllers;

use Auth;
use App\User;
use App\Product;
use App\Cart;
use App\CartItem;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function addItem(Request $request, $id)
    {
        $user = Auth::user();

        // ensure product_id exists in request
        $product_id = $request->product_id;
        if (!$product_id) {
            return response()->json(['error' => 'Missing product_id field'], 422);
        }

        // ensure cart exists
        $cart = Cart::find($id);
        if (!$cart || !$cart->exists()) {
            return response()->json(['error' => 'Cart does not exist'], 404);
        }

        // ensure cart belongs to user
        if ($cart->user->id !== $user->id) {
            return response()->json(['error' => 'Unauthorized call'], 401);
        }

        // ensure product_id points to a valid product
        $product = Product::find($product_id);
        if (!$product->exists()) {
            return response()->json(['error' => 'Product does not exist'], 404);
        }

        // default quantity to 1 if not specified
        if ($request->quantity && is_int(intval($request->quantity))) {
            $quantity = intval($request->quantity);
        } else {
            $quantity = 1;
        }

        // check if product already exists in the cart
        $cartItem = $cart->cartItems()->where('product_id', '=', $product->id);
        if ($cartItem->exists()) {
            // increase or decrease the existing quantity
            $cartItem = $cartItem->first();
            $cartItem->quantity += $quantity;

            // if quantity or stock is 0 or below, remove the item
            if ($cartItem->quantity <= 0 || $product->units <= 0) {
                $cartItem->delete();
            }
            // check for stock
            else {
                if ($product->units < $cartItem->quantity) {
                    $cartItem->quantity = $product->units;
                }

                $cartItem->save();
            }
        } else {
            // check if there is enough quantity
            if ($product->units < $quantity) {
                return response()->json(['error' => 'Out of stock'], 404);
            }

            // create the cart item and map it to cart and product
            CartItem::create([
                'cart_id' => $id,
                'product_id' => $product->id,
                'price' => $product->price,
                'quantity' => $quantity
            ]);
        }

        // fill cart data for response
        $cart['items'] = CartItem::with(['product'])->where('cart_id', '=', $cart->id)->get();
        $response = [
            'cart' => $cart,
            'msg' => 'Product added to cart'
        ];
        return response()->json($response, 200);
    }

    public function removeItem(Request $request, $id)
    {
        $user = Auth::user();

        // ensure product_id exists in request
        $product_id = $request->product_id;
        if (!$product_id) {
            return response()->json(['error' => 'Missing product_id field'], 422);
        }

        // ensure cart exists
        $cart = Cart::find($id);
        if (!$cart->exists()) {
            return response()->json(['error' => 'Cart does not exist'], 404);
        }

        // ensure cart belongs to user
        if ($cart->user->id !== $user->id) {
            return response()->json(['error' => 'Unauthorized call'], 401);
        }

        // ensure product is in cart
        $cart = Cart::find($id);
        $cartItem = $cart->cartItems()->where('product_id', '=', $product_id);
        if (!$cartItem->exists()) {
            return response()->json(['error' => 'Product is not in cart'], 404);
        }

        if (!$cartItem->first()->delete()) {
            return response()->json(['error' => 'Error Deleting Item'], 500);
        }

        // fill cart data for response
        $cart['items'] = CartItem::with(['product'])->where('cart_id', '=', $cart->id)->get();
        $response = [
            'cart' => $cart,
            'msg' => 'Product deleted from cart'
        ];
        return response()->json($response, 200);
    }
}
