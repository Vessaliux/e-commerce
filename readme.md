Clone the repository, then run the following commands from the root directory of the project:

```
mv ./.env.test ./.env
composer install
touch ./database/database.sqlite
php artisan passport:install
php artisan migrate --seed
php artisan serve
```
