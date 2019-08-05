<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\OrderItem;
use Faker\Generator as Faker;

$factory->define(OrderItem::class, function (Faker $faker) {
    return [
        'order_id' => $faker->unique()->randomDigit,
        'product_id' => $faker->unique()->randomDigit,
        'price' => $faker->randomFloat
    ];
});
