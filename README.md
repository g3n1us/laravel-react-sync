# Laravel React Sync

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/LaravelLogo.png/212px-LaravelLogo.png"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/320px-React-icon.svg.png">

Make your React components and Laravel models play nicely!


## Installation

**Install using Composer:**

```
composer require g3n1us/laravel-react-sync
```

If using Laravel 5.5 or later and autodiscovery is not disabled, the package will be discovered and ready to use automatically. If NOT, then add the service provider to the list of providers in `config/app.php`.

```
'providers' => [
	/*
	 * Application Service Providers...
	 */
	 G3n1us\LaravelReactSync\LaravelReactSyncServiceProvider::class,
]
```
> Note: The previous step will be unnecessary in most cases

**Publish React components:**

```
php artisan vendor:publish
```
Then choose `Provider: G3n1us\LaravelReactSync\LaravelReactSyncServiceProvider` from the list of options.

This will copy the package's JS assets to `resources/assets/js/vendor/laravel-react-sync`

Next, install the components via NPM
```
npm install --save resources/assets/js/vendor/laravel-react-sync
```

## Usage
Let's start with an example:
`app/File.php`
```

```

`resources/assets/js/components/File.js`
```

```


