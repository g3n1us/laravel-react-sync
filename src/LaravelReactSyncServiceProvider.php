<?php
namespace G3n1us\LaravelReactSync;	

use Illuminate\Support\ServiceProvider as LaravelServiceProvider;

class LaravelReactSyncServiceProvider extends LaravelServiceProvider{

    /**
     * Register bindings in the container.
     *
     * @return void
     */
    public function register()
    {
        $this->mergeConfigFrom(
            __DIR__.'/config.php', 'react_sync'
        );
        
    }    
    
    
    /**
     * Perform post-registration booting of services.
     *
     * @return void
     */
    public function boot()
    {
        
        $this->loadRoutesFrom(__DIR__.'/routes.php');

        $this->publishes([
            __DIR__.'/config.php' => config_path('react_sync.php'),
            __DIR__.'/assets' => resource_path('assets/js/vendor/react_sync'),            
        ]);

    }    

	
}
