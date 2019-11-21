<?php

namespace G3n1us\LaravelReactSync;

use Illuminate\Support\Arr;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Foundation\Console\Presets\Preset;

class ReactSyncPreset extends Preset
{

    private function getJsPath(){
      return is_dir(resource_path('js')) ? resource_path('js') : resource_path('assets/js');
    }

    /**
     * Install the preset.
     *
     * @return void
     */
    public static function install()
    {
        static::ensurePagesModelsDirectoriesExist();
        static::ensureComponentDirectoryExists();
        static::updatePackages();
        static::updateWebpackConfiguration();
        static::updateBootstrapping();
        static::updateComponent();
        static::removeNodeModules();
        \Artisan::call('make:react_model Example');
        \Artisan::call('make:react_page Example');
    }

    protected static function ensurePagesModelsDirectoriesExist(){
		if(!is_dir(app_path("Pages"))){
			mkdir(app_path("Pages"));
		}

		if(!is_file(app_path("Pages/.index"))){
			file_put_contents(app_path("Pages/.index"), '');
		}

		if(!is_dir(app_path("Models"))){
			mkdir(app_path("Models"));
		}

		if(!is_file(app_path("Models/.index"))){
			file_put_contents(app_path("Models/.index"), '');
		}

		if(!is_dir(resource_path("js/components"))){
			mkdir(resource_path("js/components"));
		}

		if(!is_file(resource_path("js/components/.index"))){
			file_put_contents(resource_path("js/components/.index"), '');
		}

		if(!is_file(app_path("Models/models.json"))){
			file_put_contents(app_path("Models/models.json"), json_encode([]));
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

        $js_path = is_dir(resource_path('js')) ? 'resources/js' : 'resources/assets/js';
        return [
            '@babel/preset-react' => '^7.7.0',
            '@babel/plugin-proposal-class-properties' => '^7.7.0',
            'react' => '^16.9.0',
            'react-dom' => '^16.9.0',
        ] + Arr::except($packages, ['vue']);
    }

    /**
     * Update the Webpack configuration.
     *
     * @return void
     */
    protected static function updateWebpackConfiguration()
    {
        $js_path = is_dir(resource_path('js')) ? 'js' : 'assets/js';
        copy(__DIR__.'/react-sync-stubs/webpack.mix.js', base_path('webpack.mix.js'));
    }

    /**
     * Update the example component.
     *
     * @return void
     */
    protected static function updateComponent()
    {
        $js_path = is_dir(resource_path('js')) ? 'js' : 'assets/js';

        (new Filesystem)->delete(
            resource_path("$js_path/components/ExampleComponent.vue")
        );

        copy(
            __DIR__.'/react-sync-stubs/components/App.js',
            resource_path("$js_path/components/App.js")
        );

    }

    /**
     * Update the bootstrapping files.
     *
     * @return void
     */
    protected static function updateBootstrapping()
    {
        $js_path = is_dir(resource_path('js')) ? 'js' : 'assets/js';
        copy(__DIR__.'/react-sync-stubs/app.js', resource_path("$js_path/app.js"));
    }
}
