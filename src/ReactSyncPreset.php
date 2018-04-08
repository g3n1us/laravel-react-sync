<?php

namespace G3n1us\LaravelReactSync;

use Illuminate\Support\Arr;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Foundation\Console\Presets\Preset;

class ReactSyncPreset extends Preset
{
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
        return [
            'babel-preset-react' => '^6.23.0',
            'react' => '^15.4.2',
            'react-dom' => '^15.4.2',
            'laravel-react-sync' => 'file:resources/assets/js/vendor/laravel-react-sync',
        ] + Arr::except($packages, ['vue']);
    }

    /**
     * Update the Webpack configuration.
     *
     * @return void
     */
    protected static function updateWebpackConfiguration()
    {
        copy(__DIR__.'/react-sync-stubs/webpack.mix.js', base_path('webpack.mix.js'));
    }

    /**
     * Update the example component.
     *
     * @return void
     */
    protected static function updateComponent()
    {
        (new Filesystem)->delete(
            resource_path('assets/js/components/ExampleComponent.vue')
        );

        copy(
            __DIR__.'/react-sync-stubs/Example.js',
            resource_path('assets/js/components/Example.js')
        );
        
        copy(
            __DIR__.'/react-sync-stubs/LaravelReactSync.js',
            resource_path('assets/js/vendor/laravel-react-sync/LaravelReactSync.js')
        );
        
        
        copy(
            __DIR__.'/react-sync-stubs/package.js',
            resource_path('assets/js/vendor/laravel-react-sync/package.js')
        );
        
    }

    /**
     * Update the bootstrapping files.
     *
     * @return void
     */
    protected static function updateBootstrapping()
    {
        copy(__DIR__.'/react-sync-stubs/app.js', resource_path('assets/js/app.js'));
    }
}
