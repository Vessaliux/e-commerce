<?php

namespace App\Http\Controllers;

use Auth;
use App\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(Product::all(), 200);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        // ensure user is admin
        if (!$user->is_admin) {
            return response()->json(['error' => 'Unauthorized access'], 401);
        }

        $product = Product::create([
            'name' => $request->name,
            'description' => $request->description,
            'units' => $request->units,
            'price' => $request->price,
            'image' => $request->image
        ]);

        if (!$product) {
            return response()->json(['error' => 'Error Creating Product'], 500);
        }

        $response = [
            'product' => $product,
            'products' => Product::all(),
            'msg' => "Product Created"
        ];
        return response()->json($response, 201);
    }

    public function show(Product $product)
    {
        return response()->json($product, 200);
    }

    public function uploadFile(Request $request)
    {
        if ($request->hasFile('image')) {
            $name = time() . "_" . $request->file('image')->getClientOriginalName();
            $request->file('image')->move(public_path('images'), $name);
        } else {
            return response()->json(['error' => 'Invalid file type'], 400);
        }

        $response = [
            'image' => asset("images/$name"),
            'msg' => 'Image Uploaded'
        ];
        return response()->json($response, 201);
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();

        // ensure user is admin
        if (!$user->is_admin) {
            return response()->json(['error' => 'Unauthorized access'], 401);
        }

        // ensure product exists
        $product = Product::find($id);
        if (!$product->exists()) {
            return response()->json(['error' => 'Product does not exist'], 404);
        }

        if (!$product->update($request->only(['name', 'description', 'units', 'price', 'image']))) {
            return response()->json(['error' => 'Error Updating Product'], 500);
        }

        $response = [
            'product' => $product,
            'products' => Product::all(),
            'msg' => "Product Updated"
        ];
        return response()->json($response, 200);
    }

    public function updateUnits(Request $request, Product $product)
    {
        $product->units = $product->units + $request->get('units');
        $status = $product->save();

        return response()->json([
            'status' => $status,
            'message' => $status ? "Units Added" : "Error Adding Product Units"
        ]);
    }

    public function destroy(Product $product)
    {
        $user = Auth::user();

        if (!$user->is_admin) {
            return response()->json(['error' => 'Unauthorized for non admins'], 401);
        }

        if (!$product->delete()) {
            return response()->json(['error' => 'Error deleting product'], 500);
        }

        $response = [
            'products' => Product::all(),
            'msg' => "Product Deleted"
        ];
        return response()->json($response, 200);
    }
}
