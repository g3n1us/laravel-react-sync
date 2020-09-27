<?php

namespace G3n1us\LaravelReactSync;

use Illuminate\Filesystem\Filesystem;

use Str;

class Utils	{

	public static function get_schemas(){

	    $schemas = [];

	    foreach(SyncModel::generate() as $model){
		    $schemas[class_basename($model->model)] = $model->schema;
	    }
	    return collect($schemas);

	}


	public static function get_model_properties(){
	    $props = [];

	    foreach(SyncModel::all() as $model){
		    $props[class_basename($model->model)] = $model->properties;
	    }
	    return collect($props);
	}


	public static function applyReactSyncAbilities(){
		$models = static::listModels();
		foreach($models as $model){
/*
			if(isset($model::$is_react_sync_model))
				dd($model::static_outline());
*/
		}
// 		dd($models);
	}


	public static function standardizedModelString($m){
		$str = class_basename($m);
		$str = Str::studly($str);
		$str = Str::snake(Str::plural($str));
		return $str;
	}


	public static function listModels(){
		$fs = new Filesystem;
		$namespace = config('react_sync.namespace');
		if(!is_dir(Paths::app_path('Models'))) return collect([]);

	    $possible_models = collect($fs->allFiles(Paths::app_path('Models')))
	        ->map(function($f) use($fs, $namespace){
		        if($f->getType() != 'file') return null;
		        if($f->getExtension() != 'js') return null;
		        $filename = $f->getFileName();
		        $classname = preg_replace('/^(.*?)\.js$/', '$1', $filename);
	            if($fs->exists(Paths::app_path("Models/$classname.php"))){
		            return "\\$namespace\\Models\\$classname";
	            }
	            return null;
	        })
	        ->filter()
	        ->unique()
	        ->values();

        return $possible_models;
	}


	public static function listPages(){
		$fs = new Filesystem;
		$namespace = config('react_sync.namespace');
		if(!is_dir(Paths::app_path('Pages'))) return collect([]);
	    $possible_pages = collect($fs->allFiles(Paths::app_path('Pages')))
	        ->map(function($f) use($fs, $namespace){
		        if($f->getType() != 'file') return null;
		        if($f->getExtension() != 'js') return null;
		        $filename = $f->getFileName();
		        $classname = preg_replace('/^(.*?)\.js$/', '$1', $filename);
	            if($fs->exists(Paths::app_path("Pages/$classname.php"))){
		            return "\\$namespace\\Pages\\$classname";
	            }
	            return null;
	        })
	        ->filter()
	        ->unique()
	        ->values();

        return $possible_pages;
	}


}
