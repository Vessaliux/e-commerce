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
            'name' => 'Glen',
            'email' => 'glenjangmg@gmail.com',
            'password' => 'password',
            'c_password' => 'password'
        ]);
        $response = (new UserController())->register($request);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertCount(1, User::all());
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
}
