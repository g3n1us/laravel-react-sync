<?php
use Illuminate\Http\Request;

Route::middleware(['web', 'auth', 'verified', 'enforce_email_domain'])->group(function () {

	Route::get(config('react_sync.api_path', '/update-state'), '\\G3n1us\\LaravelReactSync\\ReactUpdateController@test');
	Route::post(config('react_sync.api_path', '/update-state'), '\\G3n1us\\LaravelReactSync\\ReactUpdateController@save');
	Route::put(config('react_sync.api_path', '/update-state'), '\\G3n1us\\LaravelReactSync\\ReactUpdateController@create');
	Route::delete(config('react_sync.api_path', '/update-state'), '\\G3n1us\\LaravelReactSync\\ReactUpdateController@delete');

	$page_prefix = config('react_sync.pages_prefix', '/pages');
    Route::get("$page_prefix/{page_name}/{prop_one?}/{prop_two?}/{prop_three?}/", function(Request $request, $page_name, $prop_one = null, $pro_two = null, $prop_three = null){
        $page_slug = studly_case($page_name) . 'Page';
        $page_slug = "\\App\\Pages\\$page_slug";
        $page_class = new $page_slug($request, $page_name, $prop_one, $pro_two, $prop_three);
        return $page_class->getResponse();
    })->name('page_route');

    Route::post("$page_prefix/{page_name}/{prop_one?}/{prop_two?}/{prop_three?}/", function(Request $request, $page_name, $prop_one = null, $pro_two = null, $prop_three = null){
        $page_slug = studly_case($page_name) . 'Page';
        $page_slug = "\\App\\Pages\\$page_slug";
        $page_class = new $page_slug($request, $page_name, $prop_one, $pro_two, $prop_three);
        return $page_class->form_request($request);
    })->middleware('auth');

});
