<?php
namespace G3n1us\LaravelReactSync;

use Illuminate\Support\ServiceProvider as LaravelServiceProvider;
use Illuminate\Support\Facades\Route;

class LaravelReactSyncServiceProvider extends LaravelServiceProvider{
	use ReactSyncable;

    /**
     * Register bindings in the container.
     *
     * @return void
     */
    public function register()
    {
	    $this->syncable_register();
	}



    /**
     * Perform post-registration booting of services.
     *
     * @return void
     */
    public function boot()
    {
	    $this->syncable_boot();
// dd(Route::list());
    }
}

