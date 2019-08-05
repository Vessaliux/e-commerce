<?php

use Illuminate\Http\Request;

Route::post('/login', 'UserController@login');
Route::post('/register', 'UserController@register');
Route::get('/products', 'ProductController@index');
Route::get('/products/{product}', 'ProductController@show');
Route::get('/auth/user', 'UserController@user');

Route::group(['middleware' => 'auth:api'], function () {
    Route::get('/logout', 'UserController@logout');
    Route::patch('/users/{id}', 'UserController@update');
    Route::get('/users/{id}', 'UserController@show');
    Route::post('/users/{id}/cart', 'UserController@fetchCart');
    Route::post('/carts/{id}', 'CartController@addItem');
    Route::post('/carts/{id}/remove', 'CartController@removeItem');
    Route::get('users/{id}/order', 'OrderController@showOrders');
    Route::post('/products/upload-image', 'ProductController@uploadFile');
    Route::resource('/products', 'ProductController')->except(['index', 'show']);
    Route::post('/stripe', 'StripeController@charge');
});
