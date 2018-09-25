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
        static::ensureComponentDirectoryExists();
        static::updatePackages();
        static::updateWebpackConfiguration();
        static::updateBootstrapping();
        static::updateComponent();
        static::removeNodeModules();
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
            'babel-preset-react' => '^6.23.0',
            'react' => '^15.4.2',
            'react-dom' => '^15.4.2',
            'laravel-react-sync' => "file:$js_path/vendor/laravel-react-sync",
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
        if(is_dir(resource_path('assets/js')))
          copy(__DIR__.'/react-sync-stubs/webpack56.mix.js', base_path('webpack.mix.js'));
        else
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
            __DIR__.'/react-sync-stubs/Example.js',
            resource_path("$js_path/components/Example.js")
        );

        // make the vendor directory if it doesn't exist
        if(!is_dir(resource_path("$js_path/vendor")))
	        mkdir(resource_path("$js_path/vendor"));

        if(!is_dir(resource_path("$js_path/vendor/laravel-react-sync")))
	        mkdir(resource_path("$js_path/vendor/laravel-react-sync"));

        copy(
            __DIR__.'/assets/LaravelReactSync.js',
            resource_path("$js_path/vendor/laravel-react-sync/LaravelReactSync.js")
        );


        copy(
            __DIR__.'/assets/package.json',
            resource_path("$js_path/vendor/laravel-react-sync/package.json")
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
