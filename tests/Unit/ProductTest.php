<?php

namespace Tests\Unit;

use App;
use App\User;
use App\Product;
use App\CartItem;
use App\OrderItem;
use App\Http\Controllers\ProductController;
use Tests\TestCase;
use Illuminate\Http\Request;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function to_many_relation_with_cart_item()
    {
        $product = factory(Product::class)->create();
        $firstItem = factory(CartItem::class)->create([
            'product_id' => $product->id
        ]);
        $secondItem = factory(CartItem::class)->create([
            'product_id' => $product->id
        ]);

        $this->assertEquals($product->cartItems[0]->id, $firstItem->id);
        $this->assertEquals($product->cartItems[1]->id, $secondItem->id);
    }

    /** @test */
    public function to_many_relation_with_order_item()
    {
        $product = factory(Product::class)->create();
        $firstItem = factory(OrderItem::class)->create([
            'product_id' => $product->id
        ]);
        $secondItem = factory(OrderItem::class)->create([
            'product_id' => $product->id
        ]);

        $this->assertEquals($product->orderItems[0]->id, $firstItem->id);
        $this->assertEquals($product->orderItems[1]->id, $secondItem->id);
    }

    /** @test */
    public function admin_can_add_product()
    {
        $user = factory(User::class)->create([
            'is_admin' => true
        ]);

        \Auth::login($user);
        $request = Request::create("/products", 'POST', [
            'name' => 'MONOKUMA PLUSH',
            'description' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium incidunt eius dolores ratione, possimus amet animi consequuntur inventore labore, doloremque ut. Delectus repudiandae, dignissimos quidem ullam velit eum perspiciatis consequatur.',
            'units' => 200,
            'price' => 30.0,
            'image' => 'https://i.pinimg.com/originals/13/bc/a4/13bca4cddfa32cbba08fbcf88287ff76.jpg'
        ]);
        $response = (new ProductController())->store($request);

        $this->assertEquals(201, $response->getStatusCode());
        $this->assertCount(1, Product::all());
    }

    /** @test */
    public function non_admin_should_not_be_able_to_add_product()
    {
        $user = factory(User::class)->create([
            'is_admin' => false
        ]);

        \Auth::login($user);
        $request = Request::create("/products", 'POST', [
            'name' => 'MONOKUMA PLUSH',
            'description' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium incidunt eius dolores ratione, possimus amet animi consequuntur inventore labore, doloremque ut. Delectus repudiandae, dignissimos quidem ullam velit eum perspiciatis consequatur.',
            'units' => 200,
            'price' => 30.0,
            'image' => 'https://i.pinimg.com/originals/13/bc/a4/13bca4cddfa32cbba08fbcf88287ff76.jpg'
        ]);
        $response = (new ProductController())->store($request);

        $this->assertEquals(401, $response->getStatusCode());
        $this->assertCount(0, Product::all());
    }

    /** @test */
    public function admin_can_update_product()
    {
        $user = factory(User::class)->create([
            'is_admin' => true
        ]);
        factory(Product::class)->create([
            'id' => 1
        ]);
        $product = factory(Product::class)->create([
            'id' => 2
        ]);

        \Auth::login($user);
        $request = Request::create("/products/$product->id", 'PUT', [
            'name' => 'MONOKUMA PLUSH',
            'description' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium incidunt eius dolores ratione, possimus amet animi consequuntur inventore labore, doloremque ut. Delectus repudiandae, dignissimos quidem ullam velit eum perspiciatis consequatur.',
            'units' => 200,
            'price' => 30.0,
            'image' => 'https://i.pinimg.com/originals/13/bc/a4/13bca4cddfa32cbba08fbcf88287ff76.jpg'
        ]);
        $response = (new ProductController())->update($request, $product->id);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals($product->id, $response->getData()->product->id);
        $this->assertEquals('MONOKUMA PLUSH', $response->getData()->product->name);
    }

    /** @test */
    public function non_admin_should_not_be_able_to_update_product()
    {
        $user = factory(User::class)->create([
            'is_admin' => false
        ]);
        $product = factory(Product::class)->create();

        \Auth::login($user);
        $request = Request::create("/products/$product->id", 'PUT', [
            'name' => 'MONOKUMA PLUSH',
            'description' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium incidunt eius dolores ratione, possimus amet animi consequuntur inventore labore, doloremque ut. Delectus repudiandae, dignissimos quidem ullam velit eum perspiciatis consequatur.',
            'units' => 200,
            'price' => 30.0,
            'image' => 'https://i.pinimg.com/originals/13/bc/a4/13bca4cddfa32cbba08fbcf88287ff76.jpg'
        ]);
        $response = (new ProductController())->update($request, $product->id);

        $this->assertEquals(401, $response->getStatusCode());
        $this->assertNotEquals('MONOKUMA PLUSH', $product->name);
    }

    /** @test */
    public function admin_can_perform_partial_updates_on_a_product()
    {
        $user = factory(User::class)->create([
            'is_admin' => true
        ]);
        $product = factory(Product::class)->create();

        \Auth::login($user);
        $request = Request::create("/products/$product->id", 'PUT', [
            'name' => 'MONOKUMA PLUSH',
            'description' => 'Test Text.'
        ]);
        $response = (new ProductController())->update($request, $product->id);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertCount(1, Product::all());
        $this->assertEquals('MONOKUMA PLUSH', $response->getData()->product->name);
        $this->assertEquals('Test Text.', $response->getData()->product->description);
        $this->assertEquals($product->units, $response->getData()->product->units);
    }
}
