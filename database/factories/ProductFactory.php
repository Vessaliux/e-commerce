<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Product;
use Faker\Generator as Faker;

$factory->define(Product::class, function (Faker $faker) {
    return [
        'id' => $faker->unique()->randomDigit,
        'name' => $faker->name,
        'description' => $faker->paragraph,
        'price' => $faker->randomFloat,
        'image' => $faker->imageUrl,
        'units' => $faker->randomNumber
    ];
});
