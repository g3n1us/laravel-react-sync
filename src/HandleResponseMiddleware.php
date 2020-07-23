<?php

namespace G3n1us\LaravelReactSync;

use Closure;

use G3n1us\LaravelReactSync\Pages\Core\Page;

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

	        if(empty($potential_response)){
		        return response()->view(config('react_sync.blade_template', 'react_sync::layout'), collect($maybePage));
	        }
	        else if(view()->exists($potential_response)){
		        return response()->view($potential_response, collect($maybePage));
	        }

			return $next($request);
		    dd($potential_response);


	        if(is_array($potential_response)){
	            $potential_response = collect($potential_response);
	        }
	        $template = config('react_sync.blade_template', 'react_sync::layout');
	        $view_data = collect($this)->all();
	        if(is_string($potential_response)){
	            $template = $potential_response;
	        }
	        else if(is_object($potential_response)){
		        dd($potential_response);
	            return $this->returnObjectResponse($potential_response);
	        }

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
