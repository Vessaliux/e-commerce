<?php

use Illuminate\Http\Request;

Route::post('login', 'UserController@login');
Route::post('register', 'UserController@register');
Route::get('/products', 'ProductController@index');
Route::post('/upload-file', 'ProductController@uploadFile');
Route::get('/products/{product}', 'ProductController@show');
Route::get('/auth/user', 'UserController@user');
Route::post('/users/{user}', 'UserController@update');

Route::group(['middleware' => 'auth:api'], function () {
    Route::post('logout', 'UserController@logout');
    Route::get('/users', 'UserController@index');
    Route::patch('/users/{user}', 'UserController@update');
    Route::get('/users/{user}', 'UserController@show');
    Route::get('users/{user}/order', 'OrderController@showOrders');
    Route::patch('products/{product}/units/add', 'ProductController@updateUnits');
    Route::patch('orders/{order}/deliver', 'OrderController@deliverOrder');
    Route::resource('/orders', 'OrderController');
    Route::resource('/products', 'ProductController')->except(['index', 'show']);
    Route::post('stripe/intent', 'StripeController@createIntent');
});
