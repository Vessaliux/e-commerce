<?php

namespace Tests\Unit;

use App;
use App\User;
use App\Order;
use Tests\TestCase;
use Illuminate\Http\Request;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Http\Controllers\UserController;
use App\Http\Controllers\StripeController;

class StripeTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function check_stripe_api_charges()
    {
        $key = env('STRIPE_TEST_SECRET_KEY');
        \Stripe\Stripe::setApiKey($key);

        $charge = \Stripe\Charge::create([
            'amount' => 999,
            'currency' => 'usd',
            'source' => 'tok_visa',
            'receipt_email' => 'jenny.rosen@example.com',
        ]);

        $this->assertEquals($charge->amount, 999);
        $this->assertEquals($charge->currency, 'usd');
        $this->assertEquals($charge->receipt_email, 'jenny.rosen@example.com');
    }

    /** @test */
    public function check_stripe_api_payment_intent()
    {
        $key = env('STRIPE_TEST_SECRET_KEY');
        \Stripe\Stripe::setApiKey($key);

        $intent = \Stripe\PaymentIntent::create([
            'amount' => 999,
            'currency' => 'sgd',
            'payment_method_types' => ['card'],
            'receipt_email' => 'jenny.rosen@example.com',
        ]);

        $this->assertEquals($intent->amount, 999);
        $this->assertEquals($intent->currency, 'sgd');
        $this->assertEquals($intent->receipt_email, 'jenny.rosen@example.com');
    }

    /** @test */
    public function stripe_intent_can_be_created_with_api_call()
    {
        $request = Request::create('/stripe/intent', 'POST', [
            'amount' => 499,
        ]);
        $response = (new StripeController())->createIntent($request);

        $this->assertEquals(200, $response->getStatusCode());
    }
}
