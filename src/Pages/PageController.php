<?php

namespace G3n1us\LaravelReactSync\Pages;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller;

use Illuminate\Support\Arr;
use Illuminate\Support\Str;

use G3n1us\LaravelReactSync\Pages\Core\Page;


class PageController extends Controller{
	use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

	protected $page_class;

	protected $page_name;

	protected $page_instance;

    public function __construct(Request $request) {
        $this->page_class = Page::resolve();

        $this->middleware($this->page_class::$middleware);
    }


    public function run(){
	    $args = func_get_args();
	    $page_instance = new $this->page_class(...$args);

        if(strtolower(request()->getMethod()) == 'get'){
	        return $page_instance->getResponse();
        }
        else{
	        return $page_instance->form_request($request);
        }
    }

}
