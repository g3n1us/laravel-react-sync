<?php
use Illuminate\Http\Request;
use Illuminate\Routing\Router;

use G3n1us\LaravelReactSync\Pages\Core\Page;


Route::middleware(config('react_sync.middleware'))->group(function () {

/*
	Route::get(config('react_sync.api_path', '/update-state'), '\\G3n1us\\LaravelReactSync\\ReactUpdateController@test');
	Route::post(config('react_sync.api_path', '/update-state'), '\\G3n1us\\LaravelReactSync\\ReactUpdateController@save');
	Route::put(config('react_sync.api_path', '/update-state'), '\\G3n1us\\LaravelReactSync\\ReactUpdateController@create');
	Route::delete(config('react_sync.api_path', '/update-state'), '\\G3n1us\\LaravelReactSync\\ReactUpdateController@delete');
*/

	$page_class = Page::resolve();

	$page_prefix = config('react_sync.pages_prefix', 'pages');
	if(class_exists($page_class)){
		$class_parameter = $page_class::slug();

	    Route::prefix("{prefix}/$class_parameter")
		    ->where(['prefix' => $page_prefix])
		    ->namespace('G3n1us\\LaravelReactSync\\Pages')
		    ->group(function($route) use($page_class, $class_parameter){
			    Route::any($page_class::$pattern, 'PageController@run')->name('page_class');
		    });
	}
});
