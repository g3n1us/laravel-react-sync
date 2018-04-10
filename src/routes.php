<?php

Route::middleware(['web'])->group(function () {
	
	Route::get(config('react_sync.api_path', '/update-state'), '\\G3n1us\\LaravelReactSync\\ReactUpdateController@test');
	Route::post(config('react_sync.api_path', '/update-state'), '\\G3n1us\\LaravelReactSync\\ReactUpdateController@save');
	Route::put(config('react_sync.api_path', '/update-state'), '\\G3n1us\\LaravelReactSync\\ReactUpdateController@create');
	Route::delete(config('react_sync.api_path', '/update-state'), '\\G3n1us\\LaravelReactSync\\ReactUpdateController@delete');
			
});