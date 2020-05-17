<?php

namespace G3n1us\LaravelReactSync;

use Illuminate\Support\Arr;
use Illuminate\Filesystem\Filesystem;
use Laravel\Ui\Presets\Preset;

class ReactSyncPreset extends Preset
{

	static $include_bootstrap = false;

	static $include_example = false;

	static $start_added = true;

    private function getJsPath(){
      return is_dir(Paths::resource_path('js')) ? Paths::resource_path('js') : Paths::resource_path('assets/js');
    }

    /**
     * Install the preset.
     *
     * @return void
     */
    public static function install($command)
    {
        static::preflight($command);


        static::ensurePagesModelsDirectoriesExist();
        static::ensureComponentDirectoryExists();
        static::updatePackages();
        static::updateWebpackConfiguration();
        static::updateBootstrapping();
        static::updateComponent();
        static::removeNodeModules();
        \Artisan::call('ui:auth');
        if(self::$include_example){
	        \Artisan::call('make:react_model Example');
	        \Artisan::call('make:react_page Example');
        }

        static::addStartCommand();

        $command->info('ReactSync scaffolding installed successfully.');
        $command->comment('Please run "npm install && npm run dev" to compile your fresh scaffolding.');
        if(self::$start_added){
	        $command->comment('We\'ve added a "start" command to the scripts section of package.json:');
	        $command->comment('');
	        $command->comment('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ');
	        $command->comment('');
	        $command->comment('"start": "php artisan react_sync:all && npm run watch"');
	        $command->comment('');
	        $command->comment('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ');
	        $command->comment('');
	        $command->comment('The extra artisan commands will create your index.js files as well as write the JSON model schemas that are used by the application.');

        }
        else{
	        $command->comment('For convenience, you may add the follow to the scripts section of package.json:');
	        $command->comment('');
	        $command->comment('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ');
	        $command->comment('');
	        $command->comment('"start": "php artisan react_sync:all && npm run watch"');
	        $command->comment('');
	        $command->comment('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ');
	        $command->comment('');
	        $command->comment('This will create your index.js files as well as write the JSON model schemas that are used by the application.');

        }
        $command->comment('');
        $command->comment('Enjoy!');
        $command->comment('');

    }


    public static function preflight($command){
	    $command->info("You are about to install the Laravel ReactSync preset");
		if (!$command->confirm('Would you like to continue?', 'yes')) {
		    exit('Cancelled' . PHP_EOL);
		}

	    $command->info("The following questions will help get the preset configured for your specific requirements.");

		if ($command->confirm('Would you like to include the Bootstrap framework?', 'yes')) {
		    self::$include_bootstrap = true;
		}

		if ($command->confirm('Would you like to include an example Page and Model component to get started?', 'yes')) {
		    self::$include_example = true;
		}


    }


	public static function addStartCommand(){
        if (! file_exists(Paths::base_path('package.json'))) {
            return;
        }

        $package_json = json_decode(file_get_contents(Paths::base_path('package.json')), true);

		if(!isset($package_json['scripts']['start'])){
			$package_json['scripts']['start'] = "php artisan react_sync:all && npm run watch";
		}
		else{
			self::$start_added = false;
		}

        file_put_contents(
            Paths::base_path('package.json'),
            json_encode($package_json, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT).PHP_EOL
        );
	}


    public static function ensurePagesModelsDirectoriesExist(){
		if(!is_dir(Paths::app_path("Pages"))){
			mkdir(Paths::app_path("Pages"));
		}

		if(!is_file(Paths::app_path("Pages/.index"))){
			file_put_contents(Paths::app_path("Pages/.index"), '');
		}

		if(!is_dir(Paths::app_path("Models"))){
			mkdir(Paths::app_path("Models"));
		}

		if(!is_file(Paths::app_path("Models/.index"))){
			file_put_contents(Paths::app_path("Models/.index"), '');
		}

		if(!is_dir(Paths::resource_path("js/components"))){
			mkdir(Paths::resource_path("js/components"));
		}

		if(!is_file(Paths::resource_path("js/components/.index"))){
			file_put_contents(Paths::resource_path("js/components/.index"), '');
		}

		if(!is_file(Paths::app_path("Models/models.json"))){
			file_put_contents(Paths::app_path("Models/models.json"), json_encode([]));
		}

    }

    /**
     * Update the given package array.
     *
     * @param  array  $packages
     * @return array
     */
    protected static function updatePackageArray(array $packages)
    {
		$packages = [
            '@babel/preset-react' => '^7.7.4',
            '@babel/plugin-proposal-class-properties' => '^7.7.4',
            'react' => '^16.13.0',
            'react-dom' => '^16.13.0',
            'jquery' => '^3.5.1',
        ] + Arr::except($packages, ['vue']);

		if(self::$include_bootstrap){
			$packages = [
	            'bootstrap' => '^4.0.0',
	            'popper.js' => '^1.12'
			] + $packages;
		}

		return $packages;
    }

    /**
     * Update the Webpack configuration.
     *
     * @return void
     */
    protected static function updateWebpackConfiguration()
    {
        $js_path = is_dir(Paths::resource_path('js')) ? 'js' : 'assets/js';
        copy(__DIR__.'/react-sync-stubs/webpack.mix.js', Paths::base_path('webpack.mix.js'));
    }

    /**
     * Update the example component.
     *
     * @return void
     */
    protected static function updateComponent()
    {
        $js_path = is_dir(Paths::resource_path('js')) ? 'js' : 'assets/js';

        (new Filesystem)->delete(
            Paths::resource_path("$js_path/components/ExampleComponent.vue")
        );

        copy(
            __DIR__.'/react-sync-stubs/components/App.js',
            Paths::resource_path("$js_path/components/App.js")
        );

    }

    /**
     * Update the bootstrapping files.
     *
     * @return void
     */
    protected static function updateBootstrapping()
    {
        $js_path = is_dir(Paths::resource_path('js')) ? 'js' : 'assets/js';
        copy(__DIR__.'/react-sync-stubs/app.js', Paths::resource_path("$js_path/app.js"));
		if(self::$include_bootstrap){
			copy(__DIR__.'/react-sync-stubs/app.scss', Paths::resource_path("sass/app.scss"));
			copy(__DIR__.'/react-sync-stubs/_variables.scss', Paths::resource_path("sass/_variables.scss"));
		}
    }
}
