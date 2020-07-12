<?php

namespace G3n1us\LaravelReactSync;

use Illuminate\Support\Arr;
use Illuminate\Filesystem\Filesystem;
use Laravel\Ui\Presets\Preset;

use Laravel\Ui\UiCommand;
use Laravel\Ui\AuthCommand;


use Schema;

class ReactSyncPreset extends Preset
{

	static $include_bootstrap = false;

	static $include_example = false;

	static $start_added = true;

	static $command;

    private function getJsPath(){
		return is_dir(Paths::resource_path('js')) ? Paths::resource_path('js') : Paths::resource_path('assets/js');
    }


	public static function install_auth(AuthCommand $command){
		static::$command = $command;
		$command->call('ui:auth');
		if ($command->confirm('Would you like to use the React Sync layout in place of the default layout view template?', 'yes')) {
			copy(__DIR__.'/views/layout.blade.php', Paths::resource_path("views/layouts/app.blade.php"));
		}



	}

    /**
     * Install the preset.
     *
     * @return void
     */
    public static function install(UiCommand $command)
    {
        static::$command = $command;
        static::preflight($command);

        static::ensurePagesModelsDirectoriesExist();
        static::ensureComponentDirectoryExists();
        static::updatePackages();
        static::updateWebpackConfiguration();
        static::updateBootstrapping();
        static::updateComponent();
        static::removeNodeModules();

        $command->call('ui:auth', ['type' => 'react-sync']);
//         dd('sdf');

        if(static::$include_example){
	        $command->call('make:react_model', ['name' => 'Example']);
	        $command->call('make:react_page', ['name' => 'Example']);
        }

        static::addStartCommand();

        $command->info('ReactSync scaffolding installed successfully.');
        $command->comment('Please run "npm install && npm run dev" to compile your fresh scaffolding.');
        if(static::$start_added){
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
		try {
		    \DB::connection()->getPdo();
		} catch (\Exception $e) {
			echo PHP_EOL;
		    $command->error("Your database configuration does not appear to be configured yet. Afterwards, you will need to run 'php artisan react_sync:all' manually to complete installation.");
			echo PHP_EOL;

		}


	    $command->info("You are about to install the Laravel ReactSync preset");
		if (!$command->confirm('Would you like to continue?', 'yes')) {
		    exit('Cancelled' . PHP_EOL);
		}



	    $command->info("The following questions will help get the preset configured for your specific requirements.");

		if ($command->confirm('Would you like to include the Bootstrap framework?', 'yes')) {
		    static::$include_bootstrap = true;
		}

		if ($command->confirm('Would you like to include an example Page and Model component to get started?', 'yes')) {
		    static::$include_example = true;
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
			static::$start_added = false;
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
            'pluralize' => '^8.0.0'
        ] + Arr::except($packages, ['vue']);

		if(self::$include_bootstrap){
			$packages = [
	            'bootstrap' => '^4.0.0',
	            'popper.js' => '^1.12'
			] + $packages;
		}

		return $packages;
    }

    protected static function confirm_copy($from, $to){
        if (file_exists($from)) {
            if (! static::$command->confirm("The file [{$from}] already exists. Do you want to replace it?")) {
                return;
            }
        }

        copy($from, $to);
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
		if(static::$include_bootstrap){
			copy(__DIR__.'/react-sync-stubs/app.scss', Paths::resource_path("sass/app.scss"));
			copy(__DIR__.'/react-sync-stubs/_variables.scss', Paths::resource_path("sass/_variables.scss"));
		}
    }
}
