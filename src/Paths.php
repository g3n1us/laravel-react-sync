<?php

namespace G3n1us\LaravelReactSync;

class Paths{
	
	public static $app_path;
		
	public static $resource_path;
		
	public static $base_path;
		
	public static $public_path;
		
	public static $config_path;
		
	public static $database_path;
		
	public static function __callStatic($name, $arguments){
		
		if(!empty(static::${$name})){
			$path = count($arguments) ? $arguments[0] : "";
			return static::${$name} . str_start($path, '/');
		}
		if(function_exists($name)){
			return call_user_func_array($name, $arguments);
		}
	}
}