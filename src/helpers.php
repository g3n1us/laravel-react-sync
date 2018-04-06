<?php
	
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