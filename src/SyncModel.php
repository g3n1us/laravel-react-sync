<?php

namespace G3n1us\LaravelReactSync;

use Illuminate\Database\Eloquent\Model;

use DB;

class SyncModel extends Model{

	protected $table = "react_sync";

	protected $casts = [
		"casts" => "collection",
		"schema" => "collection",
		"properties" => "collection",
	];

	protected $fillable = [
		"model", "casts", "schema", "properties"
	];

    protected static function booted()
    {
        static::creating(function ($m) {
	        if($m->extra){
		        // dd($m->extra);
	        }
            //
        });
    }

	public static function generate(){
		DB::table("react_sync")->truncate();

	    $models = Utils::listModels();
	    return $models->map(function($model){
		    $schema = $model::static_outline();

		    $properties = $model::static_properties();

		    $casts = $schema->reduce(function($curr, $v){
			    $c = @collect($v)->get('extra')['casts'];
			    if($c){
				    $curr[$v['name']] = $c;
			    }
			    return $curr;
		    }, []);
		    return static::create([
			    "model" => get_class(new $model),
			    "schema" => $schema,
			    "properties" => $properties,
			    "casts" => $casts,
		    ]);

	    });
	}
}