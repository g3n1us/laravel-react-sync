<?php

namespace G3n1us\LaravelReactSync;

use Closure;

use G3n1us\LaravelReactSync\Page;

class HandleResponseMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next){
	    $maybePage = $request->route()->getController();
	    if($maybePage instanceof Page){

		    $response = $next($request);
	        $potential_response = $response->getContent();

			if($request->ajax()){
				return response(collect($maybePage)->all())->header('Content-Type', 'application/json');
			}

	        else if(empty($potential_response)){

		        return response()->view(config('react_sync.blade_template', 'react_sync::layout'), collect($maybePage)->all());
	        }
	        else if(view()->exists($potential_response)){

		        return response()->view($potential_response, collect($maybePage)->all());
	        }

	        return $response;

			return $next($request);
	    }
	    else return $next($request);
    }


    private function returnObjectResponse(Object $obj){
        $class_name = strtolower(class_basename($obj));
        $return_directly = ['collection', 'response', 'view'];
        if(in_array($class_name, $return_directly) || method_exists($obj, '__toString')){
            return $obj;
        }

        return collect($obj);
    }

}
