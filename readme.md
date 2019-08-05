Clone the repository, then run the following commands from the root directory of the project:

```
mv ./.env.test ./.env
composer install
touch ./database/database.sqlite
php artisan migrate --seed
php artisan passport:install
php artisan serve
```

vendor/bin/phpunit to run unit tests (sometimes fails due to Faker class generating invalid/malformed fields)

Back-end: PHP Laravel 5.8
Front-end: React (Redux, Bootstrapv4)
<br />
<br />
<b>Default admin account</b>
```
email: admin@e-commerce.test
pw: admin
```
