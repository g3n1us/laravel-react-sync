<?php
namespace App\Pages;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use G3n1us\LaravelReactSync\Pages\Core\Page;

class {{$name}} extends Page{

    // public $props_item;

    public function constructor($prop_one = null, $prop_two = null, $prop_three = null){
		// return 'template.name'; // returns Blade template view at this path (defaults to layouts.app)
		// return response($somedata);
    }

    public function form_request(Request $request){
		//
    }

}
