<?php

namespace App\Http\Controllers;

use App\User;
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

    public function index()
    {
        return response()->json(User::with(['orders'])->get());
    }

    public function login(Request $request)
    {
        $status = 422;
        $response = ['error' => 'Invalid login credentials'];

        // Always set to remember me for testing purposes
        if (Auth::attempt($request->only(['email', 'password']), true)) {
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

    public function show(User $user)
    {
        return response()->json($user);
    }

    public function showOrders(User $user)
    {
        return response()->json($user->orders->with(['product'])->get());
    }
}
