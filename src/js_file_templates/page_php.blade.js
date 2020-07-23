<?php
namespace {{ namespace }};

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use G3n1us\LaravelReactSync\Page;

class {{$name}} extends Page{

    // public $props_item;

    // public static $middleware = []; // default

    // public static $pattern = '{{$slug}}'; // default

    public function constructor(){
		// return 'template.name'; // returns Blade template view at this path (defaults to config('react_sync.blade_template', 'react_sync::layout'))
		// return response($somedata);
    }

/*
	// uncomment to handle non-GET requests to this endpoint
    public function form_request(){
		//
    }
*/

}
