<?php
namespace G3n1us\LaravelReactSync;

use Illuminate\Support\ServiceProvider as LaravelServiceProvider;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Blade;
use G3n1us\LaravelReactSync\Pages\Core\Page;
use G3n1us\LaravelReactSync\Views\Components\RenderableClass;

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
	    Blade::component('react-sync-render', RenderableClass::class);
	    $this->syncable_boot();
// dd(Route::list());
    }
}

