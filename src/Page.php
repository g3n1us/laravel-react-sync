<?php
namespace G3n1us\LaravelReactSync;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller;


use Illuminate\Support\Str;

use G3n1us\LaravelReactSync\Paths;
use G3n1us\LaravelReactSync\Utils;


abstract class Page{
	use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

	protected static $route_name;

    public static $middleware = [];

    public static $pattern = null;

    public static $default_page_class = 'DefaultPage';

    private $arguments;

	// abstract public function form_request(); // presence of this method registers non-GET requests.

    final public function __construct() {
	    if(!method_exists($this, 'constructor')){
		    throw new \Exception("There is no 'constructor' method implemented in the class " . static::class . ". This must be present to handle incoming GET requests");
	    }

        $this->page_name_class = Str::snake(class_basename($this));
        $this->page_class = class_basename($this);
        $this->request = collect(request());
    }



	public static function slug(){
		$str = class_basename(static::class);

		if($str == static::$default_page_class){
			return '';
		}

		return Str::kebab(preg_replace('/^(.*?)Page$/', '$1', $str));
	}


    public static function listPageClasses(){
		$pages = json_decode(@file_get_contents(Paths::app_path("Pages/pages.json")), true);
		return $pages ? collect($pages) : Utils::listPages();
    }


    public static function getRouteName(){
	    if(static::$route_name){
		    return Str::start(static::$route_name, "react_sync.");
	    }

		$str = class_basename(static::class);

	    return "react_sync." . Str::kebab(preg_replace('/^(.*?)Page$/', '$1', $str));
    }
}
