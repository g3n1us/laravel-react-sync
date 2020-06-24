<?php
namespace G3n1us\LaravelReactSync\Pages\Core;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;


abstract class Page{

    abstract public function form_request(Request $request);

   abstract public function constructor();

    public static $middleware = [];

    public static $pattern = '{one?}/{two?}/{three?}/{four?}/{five?}';

    public static $default_page_class = 'DefaultPage';

    private $arguments;



    final public function __construct() {
        preg_match_all('/\{(.*?)\??\}/', static::$pattern, $matches);
        $reg_pattern = static::$pattern;
        foreach(($matches[0] ?? []) as $i => $sub){
	        $key = $matches[1][$i];
	        $reg_pattern = str_replace($sub, "(?<$key>.*?)", $reg_pattern);
        }
        $reg_pattern = str_replace('/', '\\/', $reg_pattern);
        $reg_pattern = "/^$reg_pattern$/";
        $request_path = Str::start(request()->path(), '/');

        preg_match($reg_pattern, $request_path, $matches2);

		$this->arguments = array_filter($matches2, function($k) {
		    return !is_numeric($k);
		}, ARRAY_FILTER_USE_KEY);

		foreach($this->arguments as $key => $value){
			$this->{$key} = $value;
		}

        $this->page_name_class = snake_case(class_basename($this));
        $this->page_class = class_basename($this);
        $this->request = collect(request());
    }


	public static function resolve(){
		$page_prefix = Str::start(config('react_sync.pages_prefix', '/pages'), '/');

		$current_path = Str::start(request()->path(), '/');
		$current_path = Str::finish($current_path, '/');
		$pattern = "^\\$page_prefix\\/(.*?)\/";

		preg_match("/$pattern/", $current_path, $matches);

		$page_slug = @$matches[1] ?? static::$default_page_class;

	    $page_class =  Str::finish(studly_case($page_slug), 'Page');
		$namespace = config('react_sync.namespace');

	    $page_class = "\\$namespace\\Pages\\$page_class";

	    return $page_class;
	}

	public static function slug(){
    	$classpath = self::resolve();
		$str = class_basename($classpath);

		if($str == static::$default_page_class){
			return '';
		}

		return Str::kebab(preg_replace('/^(.*?)Page$/', '$1', $str));
	}

    public function getResponse(){
	    $arg_values = array_values($this->arguments);

        $potential_response = $this->constructor(...$arg_values);
        if(is_array($potential_response)){
            $potential_response = collect($potential_response);
        }
        $template = config('react_sync.blade_template', 'react_sync::layout');
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
