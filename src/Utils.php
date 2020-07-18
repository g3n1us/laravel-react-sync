<?php

namespace G3n1us\LaravelReactSync;

use Illuminate\Filesystem\Filesystem;

class Utils	{

	public static function get_schemas(){

	    $schemas = [];



	    foreach(SyncModel::generate() as $model){
		    $schemas[class_basename($model->model)] = $model->schema;
	    }
	    return collect($schemas);

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


	public static function listModels(){
		$fs = new Filesystem;
		$namespace = config('react_sync.namespace');
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
}