<?php

	if(!function_exists('client_side_safe_request')){
		function client_side_safe_request(){
			$request = request();
			return collect([
				'json' => $request->json,
				'headers' => $request->headers->all(),
				'pathInfo' => $request->getPathInfo(),
				'requestUri' => $request->getRequestUri(),
				'request' => $request->request->all(),
				'query' => $request->query->all(),
			]);
		}
	}

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


	if(!function_exists('component_exists')){
		function component_exists($name){

			$dirname = resource_path('assets/js/components');
			$iterator = new DirectoryIterator($dirname);
			$paths = [];
			foreach ($iterator as $fileInfo) {
			    if($fileInfo->isDot()) continue;
			    $paths[] = strtolower(basename($fileInfo->getFilename(), '.js'));
			}
			return in_array(strtolower($name), $paths);

		}
	}


	if(!function_exists('coerceAsArray')){
		function coerceAsArray($m){
			$r = collect((array) $m);
			return collect($r)->map(function($v, $k){
				return [preg_replace('/\\x00\*\\x00/', '', $k) => $v];
			})->values()->collapse();
		}
	}


	if(!function_exists('returnFunctionText')){
		function returnFunctionText(ReflectionMethod $method){
	        $lines = file($method->getFileName());
	        $length = $method->getEndLine() - $method->getStartLine();
	        $lines = array_slice($lines, $method->getStartLine() - 1, $length + 1);
	        return implode(PHP_EOL, $lines);
		}
	}


	if(!function_exists('get_schema')){
		function get_schema($model = null){

		}
	}

	if(!function_exists('is_plural')){
		function is_plural($string){
			return str_plural($string) == $string;
		}
	}





