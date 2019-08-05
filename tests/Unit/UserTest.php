<?php

namespace Tests\Unit;

use App;
use App\User;
use App\Order;
use Tests\TestCase;
use Illuminate\Http\Request;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Http\Controllers\UserController;

class UserTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function to_many_relation_with_order()
    {
        $user = factory(User::class)->create();
        $firstOrder = factory(Order::class)->create([
            'user_id' => $user->id
        ]);
        $secondOrder = factory(Order::class)->create([
            'user_id' => $user->id
        ]);

        $this->assertEquals($user->orders[0]->id, $firstOrder->id);
        $this->assertEquals($user->orders[1]->id, $secondOrder->id);
    }

    /** @test */
    public function user_can_register_an_account()
    {
        $request = Request::create('/register', 'POST', [
            'name' => 'John Doe',
            'email' => 'JohnDoe@test.com',
            'password' => 'password',
            'c_password' => 'password'
        ]);
        $response = (new UserController())->register($request);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertCount(1, User::all());
        $this->assertEquals('JohnDoe@test.com', User::all()->first()->email);
    }

    /** @test */
    public function user_registers_with_an_existing_email()
    {
        $user = factory(User::class)->create();
        $request = Request::create('/register', 'POST', [
            'name' => $user->name,
            'email' => $user->email,
            'password' => $user->password,
            'c_password' => $user->password
        ]);
        $response = (new UserController())->register($request);

        $this->assertEquals(422, $response->getStatusCode());
        $this->assertCount(1, User::all());
    }

    /** @test */
    public function login_should_fail_with_invalid_credentials()
    {
        factory(User::class)->create([
            'email' => 'test@test.test'
        ]);
        $request = Request::create('/login', 'POST', [
            'email' => 'JohnDoe@test.com',
            'password' => 'password'
        ]);
        $response = (new UserController())->login($request);

        $this->assertEquals(422, $response->getStatusCode());
    }

    /** @test */
    public function login_should_succeed_with_valid_credentials()
    {
        \Artisan::call('passport:install');

        factory(User::class)->create([
            'email' => 'JohnDoe@test.com'
        ]);

        $request = Request::create('/login', 'POST', [
            'email' => 'JohnDoe@test.com',
            'password' => 'password'
        ]);
        $response = (new UserController())->login($request);

        $this->assertEquals(200, $response->getStatusCode());
    }
}
