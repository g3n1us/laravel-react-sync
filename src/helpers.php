<?php
	
	if(!function_exists('current_route')){
		function current_route(){
			return collect(\Route::current())
				->map(function($v, $k){
					return [$k, $v];
				})
				->reduce(function ($coll, $v) {
					$k = preg_replace('/[^\w]/', '', $v[0]);
					$coll->put($k, $v[1]);
				    return $coll;
				}, collect([]));

		}
	}


	if(!function_exists('get_user_abilities')){
		function get_user_abilities(){

			$abilities = Gate::abilities();
			$abilities = collect($abilities)->filter(function($ability) {
				$reflection = new ReflectionFunction($ability);
				$arguments  = $reflection->getParameters();
				return count($arguments) == 1;
			});
			
			$abilities->transform(function($ability){
				return auth()->user() && $ability(auth()->user());
			});
			return $abilities;
		}
	}

	if(!function_exists('to_string_boolean')){
		function to_string_boolean($val){
			return !!$val === true ? 'true' : 'false';
		}
	}



