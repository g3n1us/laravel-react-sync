<?php
namespace G3n1us\LaravelReactSync;

use Illuminate\Database\Eloquent\Concerns\HasRelationships;

use Schema;

use ReflectionClass;

trait ReactSyncModelTrait{

	public static $is_react_sync_model = true;

	public function sync_model(){
		return SyncModel::firstWhere('model', self::class);
	}

	public function getSyncModelAttribute(){
		return $this->sync_model();
	}

	public static function static_outline(){
		return (new static)->outline();
	}

	public static function static_properties(){
		return (new static)->properties();
	}

	public function properties(){
    	$tmp = new static;
    	$props = coerceAsArray($this)->only('dateFormat', 'connection', 'primaryKey', 'keyType', 'incrementing', 'perPage', 'timestamps', 'dates', 'casts', 'appends', 'with'); // $this

    	$props['table'] = $this->getTable();
    	$props['dateFormat'] = $this->getDateFormat();
    	if($props['timestamps']){
            $props['dates'] = array_merge($props['dates'], [$tmp->getCreatedAtColumn(), $tmp->getUpdatedAtColumn()]);
    	}

    	return $props;
	}

	public function outline(){
		$connection = Schema::getConnection();

		$table = $this->getTable();
		$primary_key = $this->getKeyName();
		$per_page = $this->getPerPage();

		$casts = $this->getCasts();

		$attrs = Schema::getColumnListing($this->getTable());

		$attrs = collect($attrs)->map(function($column) use($table, $connection, $primary_key, $per_page){
			$column_definition = $connection->getDoctrineColumn($table, $column)->toArray();

			$column_definition['extra'] = json_decode($column_definition['comment'], true);

			$column_definition['type'] = $column_definition['type']->getName();

			$column_definition['nullable'] = $column_definition['notnull'] === false;

			$column_definition['fillable'] = $column_definition['autoincrement'] === false &&
			!in_array($column, ['created_at', 'updated_at']);

			$column_definition['required'] = $column_definition['fillable'] === true &&
			empty($column_definition['default']) && $column_definition['nullable'] === false;

			$column_definition['primaryKey'] = $primary_key == $column;

			$column_definition['per_page'] = $per_page;

			return [$column => $column_definition];
		})->values()->collapse();

		$appended_attrs = coerceAsArray($this)->only(['with', 'appends'])->flatten();

		$reflection = new ReflectionClass($this);

		$reflected_relations = new ReflectionClass(HasRelationships::class);
		$reflected_relations = collect($reflected_relations->getMethods())->map->getName();

		$model_name = get_class($this);

        $relations = collect($reflection->getMethods())->filter(function($v) use($model_name, $reflected_relations){
            if($v->class == $model_name){
                $function_text = returnFunctionText($v);
                $isrel = !!$reflected_relations->first(function($m) use($function_text){
	                return str_contains($function_text, '->' . $m);
                });

                return $isrel;
            }
        });

		$relations = $relations->pluck('name')->map(function($relation_name){
			$r = $this->{$relation_name}();
			if(!is_object( $r )) {
    			dd($r); die();
    			return null;
			}
			$relation_type = class_basename(get_class($r));
			$arr = coerceAsArray($r);
			$arr->transform(function($a){
				if(is_object($a)) return class_basename($a);
				else return $a;
			});
			$arr->put('relation_name', $relation_name);
			return [$relation_name => [
				'name' => $relation_name,
				'type' => 'relation',
				'relation_type' => $relation_type,
				'definition' => $arr->except('query'),
			]];
		})->filter()->collapse();

        $all = collect($attrs)->merge($relations);

		return $all;
	}

}
