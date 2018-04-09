# Laravel React Sync

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/LaravelLogo.png/212px-LaravelLogo.png"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/320px-React-icon.svg.png">

Make your React components and Laravel models play nicely!


## Installation

**Install using Composer:**

```
composer require g3n1us/laravel-react-sync
```

> Note: The next step will be unnecessary in most cases

If using Laravel 5.5 or later and autodiscovery is not disabled, the package will be discovered and ready to use automatically. If NOT, then add the service provider to the list of providers in `config/app.php`.

```php
'providers' => [
	/*
	 * Application Service Providers...
	 */
	 G3n1us\LaravelReactSync\LaravelReactSyncServiceProvider::class,
]
```

## Install `react-sync` Preset

Run the `preset` Artisan command to complete installation

```
php artisan preset react-sync
```

Follow the onscreen instructions, and run:
```
npm install && npm run dev
```

Installation is complete!

## Usage

`ReactSync` provides two base components to be used in the place of the standard `React.Component`. The first `MasterComponent` is hydrated with the Laravel view's data. This is set via an `include`d Blade template in the top of your application's markup. The provides a global object that contains application data that maps to the data that is part of the context of the Blade view. Additionally, this object contains objects and methods that provide access to the underlying Laravel application's data, such as the `Request`, defined `Guard`s, the `Route` and the authenticated user. 

This data can be used in components extending this class. Changes set via a traditional web form (or form fields) will mutate your `state` and trigger a render as you would expect in React.

Alternately, the `ReactSyncAppData.page_data` object can be mutated manually to trigger a refresh, as this object is set as the components initial `state`.  
