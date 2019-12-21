<?php
namespace G3n1us\LaravelReactSync;

use Illuminate\Support\ServiceProvider as LaravelServiceProvider;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Blade;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Foundation\Console\PresetCommand;
use Arr;


class LaravelReactSyncServiceProvider extends LaravelServiceProvider{


    private function getJsPath(){
      return is_dir(resource_path('js')) ? resource_path('js') : resource_path('assets/js');
    }

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

			View::share('randomized_var', 'react_sync_random_' . rand() . rand() . '_var');


			Blade::directive('output_alldata', function(){
				return '<?php echo $$randomized_var->toJson(); if(json_last_error() > 0) throw new \Exception("Data passed to the view cannot be serialized. This may be due to a circular structure being included. Data includes: " . $$randomized_var->keys()->implode(", \n")); ?>';
			});


	        Blade::directive('page_context', function ($id = null) {
	            if(!$id) $id = "page_context";
	            return '<script type="text/json" id="'.$id.'"><?php echo $$randomized_var->toJson(); if(json_last_error() > 0) throw new \Exception("Data passed to the view cannot be serialized. This may be due to a circular structure being included. Data includes: " . $$randomized_var->keys()->implode(", \n")); ?></script>';
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
    public function boot()
    {

        $this->loadRoutesFrom(__DIR__.'/routes.php');

        $this->loadRoutesFrom(__DIR__.'/console.php');

	    $this->loadViewsFrom(__DIR__.'/views', 'react_sync');


		$publishes = [];
		if(!file_exists(config_path('react_sync.php'))){
			$publishes[__DIR__.'/config.php'] = config_path('react_sync.php');
		}
		if(!is_dir($this->getJsPath() . '/vendor/laravel-react-sync')){
			$publishes[__DIR__.'/assets/dist'] = $this->getJsPath() . '/vendor/laravel-react-sync';
		}
        $this->publishes($publishes);

        // Load this into the `preset` Artisan command as the type: `react-sync`


        PresetCommand::macro('react-sync', function ($command_instance) {

		    ReactSyncPreset::install();

	        $command_instance->info('ReactSync scaffolding installed successfully.');
	        $command_instance->comment('Please run "npm install && npm run dev" to compile your fresh scaffolding.');
	        $command_instance->comment('For convenience, you  may add the follow to the scripts section of package.json:');
	        $command_instance->comment('');
	        $command_instance->comment('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ');
	        $command_instance->comment('');
	        $command_instance->comment('"start": "php artisan write_index_files && php artisan write_schemas && npm run watch"');
	        $command_instance->comment('');
	        $command_instance->comment('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ');
	        $command_instance->comment('');
	        $command_instance->comment('This will create your index.js files as well as write the JSON model schemas that are used by the application.');
	        $command_instance->comment('Enjoy! 🍀');
	        $command_instance->comment('');
		});

    }


}
