<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Order;
use Faker\Generator as Faker;

$factory->define(Order::class, function (Faker $faker) {
    return [
        'product_id' => $faker->unique()->randomDigit,
        'user_id' => $faker->unique()->randomDigit,
        'address' => $faker->address
    ];
});
