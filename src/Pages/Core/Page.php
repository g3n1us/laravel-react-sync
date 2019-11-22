<?php
namespace G3n1us\LaravelReactSync\Pages\Core;

use Illuminate\Http\Request;
use Illuminate\Http\Response;

abstract class Page{
    abstract public function form_request(Request $request);
    abstract public function constructor();

    final public function __construct(Request $request, $page_name = null, $prop_one = null, $prop_two = null, $prop_three = null) {
        $this->page_name = snake_case($page_name);
        $this->prop_one = $prop_one;
        $this->prop_two = $prop_two;
        $this->prop_three = $prop_three;
        $this->page_name_class = snake_case(class_basename($this));
        $this->page_class = class_basename($this);
        $this->request = $request;
    }

    public function getResponse(){
        $potential_response = $this->constructor($this->prop_one, $this->prop_two, $this->prop_three);
        if(is_array($potential_response)){
            $potential_response = collect($potential_response);
        }
        $template = 'layouts.app';
        $view_data = collect($this)->all();
        if(is_string($potential_response)){
            $template = $potential_response;
        }
        else if(is_object($potential_response)){
            return $this->returnObjectResponse($potential_response);
        }
        return response()->view($template, $view_data);
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