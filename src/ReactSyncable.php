<?php
namespace G3n1us\LaravelReactSync;

use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Blade;
use Illuminate\Database\Eloquent\Model;
use Laravel\Ui\UiCommand;

use Illuminate\Foundation\Console\PresetCommand;
use Arr;


trait ReactSyncable{

    private function getJsPath(){
      return is_dir(Paths::resource_path('js')) ? Paths::resource_path('js') : Paths::resource_path('assets/js');
    }

    /**
     * Register bindings in the container.
     *
     * @return void
     */
    public function syncable_register()
    {
        $this->mergeConfigFrom(
            __DIR__.'/config.php', 'react_sync'
        );

        View::creator('*', function ($view) {

			View::share('randomized_var', 'react_sync_random_' . rand() . rand() . '_var');


			Blade::directive('output_alldata', function(){
				return '<?php echo $$randomized_var->toJson(); if(json_last_error() > 0) throw new \Exception("Data passed to the view cannot be serialized. This may be due to a circular structure being included. Data includes: " . $$randomized_var->keys()->implode(", \n")); ?>';
			});


	        Blade::directive('page_context', function ($id = null) {
	            if(!$id) $id = "page_context";
	            return '<script type="text/json" data-react_sync_data="true" id="'.$id.'"><?php echo $$randomized_var->toJson(); if(json_last_error() > 0) throw new \Exception("Data passed to the view cannot be serialized. This may be due to a circular structure being included. Data includes: " . $$randomized_var->keys()->implode(", \n")); ?></script>';
	        });

	        Blade::directive('json_script', function($expression){
		        preg_match('/^(?<data>.*?),.?[\'"](?<id>[a-z_]*?)[\'"]$/i', $expression, $matches);

		        $data = trim(Arr::get($matches, 'data', $expression));

		        $id = trim(Arr::get($matches, 'id', 'json_script'));

		        $return = "collect($data)->toJson()";

		        return "<script type=\"text/json\" data-react_sync_data=\"true\" id=\"$id\"><?php echo {$return}; ?></script>";
	        });


			Blade::directive('all_data', function(){
				return '<?php
			        $$randomized_var = collect(\Illuminate\Support\Arr::except(get_defined_vars(), [\'__data\', \'__path\', \'__env\']));
			        // Now find objects and arrays containing Models
			        $model_arr = [];
			        foreach($$randomized_var as $k => $d){
				        if(!is_iterable($d)){
					        $d = [$d];
				        }
				        foreach($d as $m){
					        if($m instanceOf Model){
						        $classname = class_basename( get_class($m) );
						        \Illuminate\Support\Arr::set($model_arr, "$classname.{$m->id}", $m);
					        }
					        if(is_iterable($m)){
						        foreach($m as $mm){
							        if($mm instanceOf Model){
								        $classname = class_basename( get_class($mm) );
								        \Illuminate\Support\Arr::set($model_arr, "$classname.{$mm->id}", $mm);
							        }
						        }
					        }
				        }
			        }
					$$randomized_var->put(\'models\', $model_arr); ?>';
		    });

	        // auto_jsonable route stuff below ... TODO apply middleware from the original route to secure the ajax requested version. Is this needed??
	        $route = \Route::current();
			if($route){
				// Find out if the route can be output automatically as JSON. This can be done via config, or by applying a trait to the controller.
		        $route_controller = is_object($route->controller) ? class_basename(get_class($route->controller)) : false;

		        $uses_trait = is_object($route->controller) && method_exists(get_class($route->controller), 'isJsonable');

		        $route_name = $route->getName();

		        $route_is_ok = $uses_trait || in_array($route_controller, config('react_sync.jsonable_controllers')) || in_array($route_name, config('react_sync.jsonable_routes'));


				if(request()->input('asajax')){
					$view->setPath(__DIR__ . '/views/as_json.blade.php');
			        response($view)->header('Content-Type', 'application/json')->send();
			        exit();
				}

		        if(request()->ajax() && request()->getMethod() === 'GET' && $route_is_ok ){
					$view->setPath(__DIR__ . '/views/as_json.blade.php');
			        response($view)->header('Content-Type', 'application/json')->send();
			        exit();
		        }
	        }
	    });
	}



    /**
     * Perform post-registration booting of services.
     *
     * @return void
     */
    public function syncable_boot()
    {
		$this->loadMigrationsFrom(__DIR__.'/migrations');

        $this->loadRoutesFrom(__DIR__.'/routes.php');

        if ($this->app->runningInConsole()) {
	        $this->loadRoutesFrom(__DIR__.'/console.php');
        }

	    $this->loadViewsFrom(__DIR__.'/views', 'react_sync');

		$publishes = [];
		if(!file_exists(Paths::config_path('react_sync.php'))){
			$publishes[__DIR__.'/config.php'] = Paths::config_path('react_sync.php');
		}

		$publishes[__DIR__.'/views'] = Paths::resource_path('views/vendor/react_sync');  // resource_path('views/vendor/courier')

        $this->publishes($publishes, 'laravel-react-sync');

        // Load this into the `ui` Artisan command as the type: `react-sync`

		UiCommand::macro('react-sync', function ($command) {
			if($command instanceof UiCommand){
				ReactSyncPreset::install($command);
			}
			else{
				ReactSyncPreset::install_auth($command);
			}

		});

		Utils::applyReactSyncAbilities();

    }

}
