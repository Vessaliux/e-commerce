Clone the repository, then run the following commands from the root of the project directory:

```
mv ./.env.test ./.env
composer install
touch ./database/database.sqlite
php artisan migrate --seed
php artisan passport:install
php artisan serve
```
  
Back-end: PHP Laravel 5.8  
Front-end: React (Redux, Bootstrapv4)  
  
Default admin account</b>
```
email: admin@e-commerce.test
pw: admin
```
  
Test Payment Information (Stripe)
```  
Card Number: 4242 4242 4242 4242
Expiry: Any future date
CVV: Any 3 digit
Zip: Any 5 digit
```
  
```vendor/bin/phpunit``` to run unit tests (sometimes fails due to Faker class generating invalid/malformed fields)  
Unit test functions in ```/tests/Unit/```
