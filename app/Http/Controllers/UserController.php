<?php

namespace App\Http\Controllers;

use App\User;
use App\Cart;
use App\CartItem;
use App\Product;
use Auth;
use Validator;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('client.credentials')->only(['user']);
    }

    public function user(Request $request)
    {
        $status = 200;
        $response = [
            'user' => $request->user('api')
        ];

        return response()->json($response, $status);
    }

    public function login(Request $request)
    {
        $status = 422;
        $response = ['error' => 'Invalid login credentials'];

        // Always set to remember me for testing purposes
        if (Auth::attempt($request->only(['email', 'password']), $request['remember'])) {
            $status = 200;
            $response = [
                'user' => Auth::user(),
                'token' => Auth::user()->createToken('e-commerce')->accessToken
            ];
        }

        return response()->json($response, $status);
    }

    public function logout()
    {
        Auth::logout();

        $status = 200;
        $response = 'Logged out';

        return response()->json($response, $status);
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:50',
            'email' => 'required|email',
            'password' => 'required|min:5',
            'c_password' => 'required|same:password'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $data = $request->only(['name', 'email', 'password']);
        $data["password"] = bcrypt($data['password']);

        try {
            $user = User::create($data);
        } catch (\Illuminate\Database\QueryException $ex) {
            return response()->json(['error' => 'Email already exists'], 422);
        }

        $user->is_admin = 0;

        return response()->json(['msg' => 'Registration successful'], 200);
    }

    public function update(Request $request, $id)
    {
        $user = User::where('id', '=', $id)->first();

        if ($user === null) {
            return response()->json(['error' => 'User does not exist'], 404);
        }

        try {
            $user->update($request->all());
        } catch (\Illuminate\Database\QueryException $ex) {
            return response()->json(['error' => 'Email already exists'], 422);
        }
    }

    // fetch the active cart for the user
    public function fetchCart(Request $request, $id)
    {
        // parse id to int
        $id = intval($id);

        // refuse if not admin nor intended recipient
        $user = Auth::user();

        if ($user->id !== $id && !$user->is_admin) {
            return response()->json(['error' => $id], 401);
        }

        $user = User::where('id', '=', $id)->first();
        $cart = $user->carts()->where('checked_out', '=', false);

        // no active cart available, create one
        if (!$cart->exists()) {
            $cart = Cart::create([
                'user_id' => $user->id
            ]);
        } else {
            $cart = $cart->get()->first();
        }

        // remove item or reduce quantity depending on stock
        $cartItems = CartItem::with(['product'])->where('cart_id', '=', $cart->id)->where('quantity', '<', 'units')->where('units', '>', 0)->get();
        foreach ($cartItems as $cartItem) {
            if ($cartItem->product->units <= 0) {
                $cartItem->delete();
            } else if ($cartItem->quantity > $cartItem->product->units) {
                $cartItem->quantity = $cartItem->product->units;
                $cartItem->save();
            }
        }

        // fill cart data for response
        $cart['items'] = $cartItems;
        $response = [
            'cart' => $cart,
            'msg' => 'Cart fetched'
        ];

        return response()->json($response, 200);
    }
}
