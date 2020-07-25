<?php
use Illuminate\Http\Request;
use Illuminate\Routing\Router;

use G3n1us\LaravelReactSync\Pages\Core\Page;
use G3n1us\LaravelReactSync\Paths;
use G3n1us\LaravelReactSync\Utils;

Route::prefix(config('react_sync.pages_prefix', ''))->group(function () {

	$pages = Page::listPageClasses();

	foreach($pages as $page_class){
		$pattern = $page_class::$pattern ?? Str::start($page_class::slug(), '/');

		$routes[] = Route::match(['get', 'options'], $pattern, $page_class . '@constructor');

		if(method_exists($page_class, 'form_request')){
			$routes[] = Route::match(['post', 'put', 'patch', 'delete'], $pattern, $page_class . '@form_request');
		}

		foreach($routes as $route){
			$route->middleware((array) $page_class::$middleware + ['web', G3n1us\LaravelReactSync\HandleResponseMiddleware::class]);
		}
	}

});
