<?php

use App\User;
use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = new User;
        $user->name = "admin";
        $user->email = "admin@e-commerce.test";
        $user->password = bcrypt('admin');
        $user->is_admin = true;
        $user->save();
    }
}
