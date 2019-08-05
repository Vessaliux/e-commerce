<?php

namespace Tests\Unit;

use App;
use App\Order;
use App\OrderItem;
use Tests\TestCase;
use Illuminate\Http\Request;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Http\Controllers\UserController;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function to_many_relation_with_order_item()
    {
        $order = factory(Order::class)->create();
        $firstItem = factory(OrderItem::class)->create([
            'order_id' => $order->id
        ]);
        $secondItem = factory(OrderItem::class)->create([
            'order_id' => $order->id
        ]);

        $this->assertEquals($order->orderItems[0]->id, $firstItem->id);
        $this->assertEquals($order->orderItems[1]->id, $secondItem->id);
    }
}
