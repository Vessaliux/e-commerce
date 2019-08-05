<?php

namespace Tests\Unit;

use App;
use App\User;
use App\Product;
use App\Cart;
use App\CartItem;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CartController;
use Tests\TestCase;
use Illuminate\Http\Request;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CartTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function to_many_relation_with_cart_item()
    {
        $cart = factory(Cart::class)->create();
        $firstItem = factory(CartItem::class)->create([
            'cart_id' => $cart->id
        ]);
        $secondItem = factory(CartItem::class)->create([
            'cart_id' => $cart->id
        ]);

        $this->assertEquals($cart->cartItems[0]->id, $firstItem->id);
        $this->assertEquals($cart->cartItems[1]->id, $secondItem->id);
    }

    /** @test */
    public function fetching_cart_for_user_without_cart_should_create_and_return_a_cart()
    {
        $user = factory(User::class)->create();
        \Auth::login($user);

        $request = Request::create("/users/$user->id/cart", 'POST');
        $response = (new UserController())->fetchCart($request, $user->id);

        $this->assertCount(1, $user->carts()->get());
        $this->assertEquals($user->id, $response->getData()->cart->user_id);
    }

    /** @test */
    public function fetching_cart_for_user_with_cart_should_return_existing_cart()
    {
        $user = factory(User::class)->create();
        $cart = factory(Cart::class)->create([
            'user_id' => $user->id
        ]);
        \Auth::login($user);

        $request = Request::create("/users/$user->id/cart", 'POST');
        $response = (new UserController())->fetchCart($request, $user->id);

        $this->assertCount(1, $user->carts()->get());
        $this->assertEquals($cart->id, $response->getData()->cart->id);
    }

    /** @test */
    public function users_should_not_be_able_to_fetch_others_cart()
    {
        $user1 = factory(User::class)->create();
        $cart = factory(Cart::class)->create([
            'user_id' => $user1->id
        ]);
        $user2 = factory(User::class)->create();
        \Auth::login($user2);

        $request = Request::create("/users/$user1->id/cart", 'POST');
        $response = (new UserController())->fetchCart($request, $user1->id);

        $this->assertEquals(401, $response->getStatusCode());
    }

    /** @test */
    public function admin_should_be_able_to_fetch_others_cart()
    {
        $user1 = factory(User::class)->create();
        $cart = factory(Cart::class)->create([
            'user_id' => $user1->id
        ]);
        $user2 = factory(User::class)->create([
            'is_admin' => true
        ]);
        \Auth::login($user2);

        $request = Request::create("/users/$user1->id/cart", 'POST');
        $response = (new UserController())->fetchCart($request, $user1->id);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals($cart->id, $response->getData()->cart->id);
    }

    /** @test */
    public function adding_an_item_to_the_cart_should_generate_and_map_CartItem()
    {
        $user = factory(User::class)->create();
        $cart = factory(Cart::class)->create([
            'user_id' => $user->id
        ]);
        $product_1 = factory(Product::class)->create();

        \Auth::login($user);
        $request = Request::create("/carts/$cart->id", 'POST', [
            'product_id' => $product_1->id
        ]);
        $response = (new CartController())->addItem($request, $cart->id);

        $this->assertCount(1, $response->getData()->cart->items);
        $this->assertEquals($response->getData()->cart->items[0]->product->name, $product_1->name);
    }

    /** @test */
    public function adding_an_existing_item_to_the_cart_should_add_to_existing_CartItem_quantity()
    {
        $user = factory(User::class)->create();
        $cart = factory(Cart::class)->create([
            'user_id' => $user->id
        ]);
        $product_1 = factory(Product::class)->create([
            'price' => 9.99
        ]);
        factory(CartItem::class)->create([
            'cart_id' => $cart->id,
            'product_id' => $product_1->id,
            'price' => $product_1->price,
            'quantity' => 5
        ]);

        \Auth::login($user);
        $request = Request::create("/carts/$cart->id", 'POST', [
            'product_id' => $product_1->id,
            'quantity' => 3
        ]);
        $response = (new CartController())->addItem($request, $cart->id);

        $this->assertEquals($response->getData()->cart->items[0]->product->name, $product_1->name);
        $this->assertEquals(8, $response->getData()->cart->items[0]->quantity);
    }

    /** @test */
    public function user_can_remove_cart_item()
    {
        $user = factory(User::class)->create();
        $cart = factory(Cart::class)->create([
            'user_id' => $user->id
        ]);
        $product_1 = factory(Product::class)->create([
            'price' => 9.99
        ]);
        factory(CartItem::class)->create([
            'cart_id' => $cart->id,
            'product_id' => $product_1->id,
            'price' => $product_1->price,
            'quantity' => 5
        ]);

        \Auth::login($user);
        $request = Request::create("/carts/$cart->id/remove", 'POST', [
            'product_id' => $product_1->id
        ]);
        $response = (new CartController())->removeItem($request, $cart->id);

        $this->assertCount(0, CartItem::all());
    }

    /** @test */
    public function reducing_quantity_to_0_should_remove_item()
    {
        $user = factory(User::class)->create();
        $cart = factory(Cart::class)->create([
            'user_id' => $user->id
        ]);
        $product_1 = factory(Product::class)->create([
            'price' => 9.99
        ]);
        factory(CartItem::class)->create([
            'cart_id' => $cart->id,
            'product_id' => $product_1->id,
            'price' => $product_1->price,
            'quantity' => 2
        ]);

        \Auth::login($user);
        $request = Request::create("/carts/$cart->id", 'POST', [
            'product_id' => $product_1->id,
            'quantity' => -2
        ]);
        $response = (new CartController())->addItem($request, $cart->id);

        $this->assertCount(0, CartItem::all());
    }

    /** @test */
    public function fetching_cart_should_return_relevant_data()
    {
        $user = factory(User::class)->create();
        $cart = factory(Cart::class)->create([
            'user_id' => $user->id
        ]);
        $product_1 = factory(Product::class)->create([
            'price' => 9.99
        ]);
        $product_2 = factory(Product::class)->create([
            'price' => 19.99
        ]);
        factory(CartItem::class)->create([
            'cart_id' => $cart->id,
            'product_id' => $product_1->id,
            'price' => $product_1->price
        ]);
        factory(CartItem::class)->create([
            'cart_id' => $cart->id,
            'product_id' => $product_2->id,
            'price' => $product_2->price
        ]);

        \Auth::login($user);
        $request = Request::create("/users/$user->id/cart", 'POST');
        $response = (new UserController())->fetchCart($request, $user->id);

        $this->assertCount(2, $response->getData()->cart->items);
        $this->assertEquals($response->getData()->cart->items[0]->product->name, $product_1->name);
        $this->assertEquals($response->getData()->cart->items[1]->product->price, $product_2->price);
    }
}
