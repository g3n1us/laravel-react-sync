<?php
use Illuminate\Http\Request;
use Illuminate\Routing\Router;

// use Illuminate\Routing\Route;

use G3n1us\LaravelReactSync\Pages\Core\Page;
use G3n1us\LaravelReactSync\Paths;
use G3n1us\LaravelReactSync\Utils;


// Route::prefix()

// Route::namespace('G3n1us\\LaravelReactSync\\Pages')->group(function () {
// Route::namespace('App\\Pages')->group(function () {

	Route::prefix(config('react_sync.pages_prefix', ''))->group(function () {

		$pages = Page::listPageClasses();

		foreach($pages as $page_class){
			$route = Route::any($page_class::$pattern, $page_class . '@constructor');
			if(!empty($page_class::$middleware)){
				$route->middleware($page_class::$middleware);
			}
		}

	});


// });


/*


Route::middleware(config('react_sync.middleware'))->group(function () {

	$page_class = Page::resolve();

	$page_prefix = trim(config('react_sync.pages_prefix', 'pages'), '/');
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
*/
