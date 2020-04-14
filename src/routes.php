<?php
use Illuminate\Http\Request;

Route::middleware(config('react_sync.middleware'))->group(function () {

	Route::get(config('react_sync.api_path', '/update-state'), '\\G3n1us\\LaravelReactSync\\ReactUpdateController@test');
	Route::post(config('react_sync.api_path', '/update-state'), '\\G3n1us\\LaravelReactSync\\ReactUpdateController@save');
	Route::put(config('react_sync.api_path', '/update-state'), '\\G3n1us\\LaravelReactSync\\ReactUpdateController@create');
	Route::delete(config('react_sync.api_path', '/update-state'), '\\G3n1us\\LaravelReactSync\\ReactUpdateController@delete');

	$page_prefix = config('react_sync.pages_prefix', '/pages');

    Route::prefix($page_prefix)->group(function() {
	    Route::any("/{page_name}/{prop_one?}/{prop_two?}/{prop_three?}/", function(Request $request, $page_name, $prop_one = null, $pro_two = null, $prop_three = null){
	        $page_slug = studly_case($page_name) . 'Page';
	        $namespace = str_start(config('react_sync.namespace'), '\\');
	        $page_slug = "$namespace\\Pages\\$page_slug";
	        $page_class = new $page_slug($request, $page_name, $prop_one, $pro_two, $prop_three);

	        if(strtolower($request->getMethod()) == 'get'){
		        return $page_class->getResponse();
	        }
	        else{
		        return $page_class->form_request($request);
	        }

	    })->name('page_route');
    });
});
