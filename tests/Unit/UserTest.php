<?php

namespace Tests\Unit;

use App;
use App\User;
use App\Order;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

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
}
