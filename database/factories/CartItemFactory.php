<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\CartItem;
use Faker\Generator as Faker;

$factory->define(CartItem::class, function (Faker $faker) {
    return [
        'cart_id' => $faker->unique()->randomDigit,
        'product_id' => $faker->unique()->randomDigit,
        'price' => $faker->randomFloat
    ];
});
