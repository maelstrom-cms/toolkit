<?php

namespace Maelstrom\Providers;

use Illuminate\Support\ServiceProvider;

class MaelstromServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        // ...
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        $this->publishes([
            __DIR__ . '/../views' => resource_path('views/vendor/maelstrom'),
        ], 'maelstrom-views');

        $this->publishes([
            __DIR__ . '/../config/maelstrom.php' => config_path('maelstrom.php'),
        ], 'maelstrom-config');

        $this->publishes([
            __DIR__ . '/../../ui/stubs/maelstrom.css.stub' => resource_path('sass/maelstrom.css'),
            __DIR__ . '/../../ui/stubs/maelstrom.js.stub' => resource_path('js/maelstrom.js'),
            __DIR__ . '/../../ui/stubs/babel.config.js.stub' => base_path('babel.config.js'),
            __DIR__ . '/../../ui/stubs/webpack.mix.js.stub' => base_path('webpack.mix.js'),
        ], 'maelstrom-stubs');

        $this->mergeConfigFrom(
            __DIR__ . '/../config/maelstrom.php',
            'maelstrom'
        );

        require_once __DIR__ . '/../helpers.php';

        $this->loadViewsFrom(__DIR__ . '/../views', 'maelstrom');

        $this->loadMigrationsFrom(__DIR__ . '/../database/migrations');

        $this->loadRoutesFrom(__DIR__ . '/../routes/maelstrom.php');
    }
}
