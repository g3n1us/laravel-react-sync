<?php

Route::middleware(['web'])->group(function () {
	
	Route::get('/update-state', '\\G3n1us\\LaravelReactSync\\ReactUpdateController@test');
	Route::post('/update-state', '\\G3n1us\\LaravelReactSync\\ReactUpdateController@save');
	Route::put('/update-state', '\\G3n1us\\LaravelReactSync\\ReactUpdateController@create');
	Route::delete('/update-state', '\\G3n1us\\LaravelReactSync\\ReactUpdateController@delete');
			
});