<?php
namespace G3n1us\LaravelReactSync;	

use Illuminate\Support\ServiceProvider as LaravelServiceProvider;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Blade;
use Illuminate\Database\Eloquent\Model;


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
        
        
        View::creator('*', function ($view) {
	        $alldata = collect($view->getFactory()->getShared())
		        ->merge($view->getData())
		        ->except('__env', 'app');
	        // Now find objects and arrays containing Models
	        $model_arr = [];
	        foreach($alldata as $k => $d){
		        if(!is_iterable($d)){
			        $d = [$d];
		        }
		        foreach($d as $m){
			        if($m instanceOf Model){
				        $classname = class_basename( get_class($m) );
				        $model_arr["$classname.{$m->id}"] = $m;
			        }
		        }
	        }
	        
	        // $model_arr now exists and can be used somewhere. Hmmm ... where?
	        
	        View::share('page_data', $alldata);
		        
	        // auto_jsonable route stuff below ... TODO apply middleware from the original route to secure the ajax requested version. Is this needed??
	        $route = \Route::current();
			if($route){
				// Find out if the route can be output automatically as JSON. This can be done via config, or by applying a trait to the controller.
		        $route_controller = is_object($route->controller) ? class_basename(get_class($route->controller)) : false;

		        $uses_trait = is_object($route->controller) && method_exists(get_class($route->controller), 'isJsonable');

		        $route_name = $route->getName();

		        $route_is_ok = $uses_trait || in_array($route_controller, config('react_sync.jsonable_controllers')) || in_array($route_name, config('react_sync.jsonable_routes'));
				if(request()->input('asajax')){
			        response($alldata)->header('Content-Type', 'application/json')->send();
			        exit();
				}
		        if(request()->ajax() && request()->getMethod() === 'GET' && $route_is_ok ){
			        response($alldata)->header('Content-Type', 'application/json')->send();
			        exit();
		        }
	        }
	        Blade::directive('page_state_embed', function ($expression) use($alldata){
		        $return = $alldata->toJson();
			        
		        $page_state_embed = "<script>window.page_state_data=$return</script>";
		        
	            return "<?php echo '$page_state_embed'; ?>";
	        });
        });    
        
        // Allow Laravel 5.5.* by checking version and polyfilling where needed
		if(version_compare((app())::VERSION, "5.6.0", "<")){
	        Blade::directive('csrf', function ($expression) {
		        return "<?php echo csrf_field(); ?>";
	        });
		}
        
        
    }    
    
    
    /**
     * Perform post-registration booting of services.
     *
     * @return void
     */
    public function boot()
    {
        
        $this->loadRoutesFrom(__DIR__.'/routes.php');
        
	    $this->loadViewsFrom(__DIR__.'/views', 'react_sync');        

        $this->publishes([
            __DIR__.'/config.php' => config_path('react_sync.php'),
            __DIR__.'/assets' => resource_path('assets/js/vendor/laravel-react-sync'),            
        ]);

    }    

	
}
