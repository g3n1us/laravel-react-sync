<?php
namespace G3n1us\LaravelReactSync;

use Illuminate\Support\ServiceProvider as LaravelServiceProvider;
use Illuminate\Support\Facades\Route;
use G3n1us\LaravelReactSync\Page;

class LaravelReactSyncServiceProvider extends LaravelServiceProvider{
	use ReactSyncable;


	private function installed(){
		return is_dir(app_path() . '/Pages');
	}

    /**
     * Register bindings in the container.
     *
     * @return void
     */
    public function register()
    {

	    $this->syncable_register();

		$this->app->bind(Page::class, function ($app) {
		    return new Page;
		});

	}



    /**
     * Perform post-registration booting of services.
     *
     * @return void
     */
    public function boot()
    {

	    $this->syncable_boot();

    }
}

