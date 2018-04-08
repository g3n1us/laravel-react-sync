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

## Install ReactSync Preset

Run the `preset` Artisan command to complete installation

```
php artisan preset react-sync
```

Follow the instructions you will see, and run:
```
npm install && npm run dev
```

Installation is complete!

## Usage

...