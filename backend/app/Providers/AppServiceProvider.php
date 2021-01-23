<?php

namespace App\Providers;

use App\Repositories\Impl\VietnameseRepositoryImpl;
use App\Repositories\VietnameseRepository;
use App\Services\Impl\VietnameseServiceImpl;
use App\Services\VietnameseService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
// Repositories
        $this->app->singleton(
            VietnameseRepository::class,
            VietnameseRepositoryImpl::class
        );

        // Services
        $this->app->singleton(
            VietnameseService::class,
            VietnameseServiceImpl::class
        );    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
