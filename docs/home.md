# Laravel React Sync

- [Introduction](#introduction)
- [Installation](#installation)
    - [Preset](#preset)
    - [Publish Configuration Files](#publish)

<a name="introduction"></a>
## Introduction
Laravel React Sync is a comprehensive framework fusing React and Laravel into an ...


<a name="installation"></a>
## Installation
**Install using Composer:**

```
composer require g3n1us/laravel-react-sync
```


<a name="preset"></a>
### UI Preset

Next run the UI preset installer to create your frontend scaffolding. The installer is interactive, and will ask you a few questions to better suit your specific needs.

```
php artisan ui react-sync --auth
```

<a name="publish"></a>
### Publish Configuration Files

You will want to publish the configuration files by running the command:

```
php artisan vendor:publish --tag="laravel-react-sync"
```

The library uses g3n1us/model-api as well, so if you would like to further configure this library, you may publish it's configuration as well

```
php artisan vendor:publish --provider="G3n1us\ModelApi\ServiceProvider\
"
```

You are now set up and ready to go!

Next, create models and routes.