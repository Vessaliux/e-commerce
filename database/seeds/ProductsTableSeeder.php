<?php

use Illuminate\Database\Seeder;

class ProductsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $products = [
            [
                'name' => "MONOKUMA PLUSH",
                'description' => "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium incidunt eius dolores ratione, possimus amet animi consequuntur inventore labore, doloremque ut. Delectus repudiandae, dignissimos quidem ullam velit eum perspiciatis consequatur.",
                'units' => 200,
                'price' => 30.00,
                'image' => "https://i.pinimg.com/originals/13/bc/a4/13bca4cddfa32cbba08fbcf88287ff76.jpg",
                'created_at' => new DateTime,
                'updated_at' => null
            ],
            [
                'name' => "MONOMI PLUSH",
                'description' => "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium incidunt eius dolores ratione, possimus amet animi consequuntur inventore labore, doloremque ut. Delectus repudiandae, dignissimos quidem ullam velit eum perspiciatis consequatur.",
                'units' => 100,
                'price' => 35.00,
                'image' => "https://images-na.ssl-images-amazon.com/images/I/31bpyeuOTHL._SX425_.jpg",
                'created_at' => new DateTime,
                'updated_at' => null
            ],
            [
                'name' => "MONOKUBS FIGURE SET",
                'description' => "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium incidunt eius dolores ratione, possimus amet animi consequuntur inventore labore, doloremque ut. Delectus repudiandae, dignissimos quidem ullam velit eum perspiciatis consequatur.",
                'units' => 50,
                'price' => 99.99,
                'image' => "https://static.myfigurecollection.net/image/KittanZero1526048995.jpeg",
                'created_at' => new DateTime,
                'updated_at' => null
            ],
            [
                'name' => "MONOKUMA CARD HOLDER",
                'description' => "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium incidunt eius dolores ratione, possimus amet animi consequuntur inventore labore, doloremque ut. Delectus repudiandae, dignissimos quidem ullam velit eum perspiciatis consequatur.",
                'units' => 1000,
                'price' => 9.99,
                'image' => "https://d3ieicw58ybon5.cloudfront.net/ex/228.228/0.0.800.800/shop/product/6a908484d5034b36aebc9b995b2771fe.jpg",
                'created_at' => new DateTime,
                'updated_at' => null
            ],
        ];

        DB::table('products')->insert($products);
    }
}
