<?php

	if(!function_exists('client_side_safe_request')){
		function client_side_safe_request(){
			$request = request();
			return collect([
				'json' => $request->json,
				'headers' => $request->headers->all(),
				'pathInfo' => $request->getPathInfo(),
				'requestUri' => $request->getRequestUri(),
				'request' => $request->request->all(),
				'query' => $request->query->all(),
			]);
		}
	}

	if(!function_exists('current_route')){
		function current_route(){
			return collect(\Route::current())
				->map(function($v, $k){
					return [$k, $v];
				})
				->reduce(function ($coll, $v) {
					$k = preg_replace('/[^\w]/', '', $v[0]);
					$coll->put($k, $v[1]);
				    return $coll;
				}, collect([]));

		}
	}


	if(!function_exists('get_user_abilities')){
		function get_user_abilities(){

			$abilities = Gate::abilities();
			$abilities = collect($abilities)->filter(function($ability) {
				$reflection = new ReflectionFunction($ability);
				$arguments  = $reflection->getParameters();
				return count($arguments) == 1;
			});

			$abilities->transform(function($ability){
				return auth()->user() && $ability(auth()->user());
			});
			return $abilities;
		}
	}

	if(!function_exists('to_string_boolean')){
		function to_string_boolean($val){
			return !!$val === true ? 'true' : 'false';
		}
	}

	if(!function_exists('component_exists')){
		function component_exists($name){

			$dirname = resource_path('assets/js/components');
			$iterator = new DirectoryIterator($dirname);
			$paths = [];
			foreach ($iterator as $fileInfo) {
			    if($fileInfo->isDot()) continue;
			    $paths[] = strtolower(basename($fileInfo->getFilename(), '.js'));
			}
			return in_array(strtolower($name), $paths);

		}
	}


	if(!function_exists('coerceAsArray')){
		function coerceAsArray($m){
			$r = collect((array) $m);
			return collect($r)->map(function($v, $k){
				return [preg_replace('/\\x00\*\\x00/', '', $k) => $v];
			})->values()->collapse();
		}
	}


	function returnFunctionText(ReflectionMethod $method){
        $lines = file($method->getFileName());
        $length = $method->getEndLine() - $method->getStartLine();
        $lines = array_slice($lines, $method->getStartLine() - 1, $length + 1);
        return implode(PHP_EOL, $lines);
	}


	if(!function_exists('get_schema')){
		function get_schema($model = null){
			$connection = Schema::getConnection();
			try {
			    \DB::connection()->getPdo();
			} catch (\Exception $e) {

				return;
			}


			if($model === null) die("\npass in a model instance!\n\n");

			$table = $model->getTable();
			$primary_key = $model->getKeyName();

			$attrs = Schema::getColumnListing($model->getTable());

			$attrs = collect($attrs)->map(function($column) use($table, $connection, $primary_key){
				$column_definition = $connection->getDoctrineColumn($table, $column)->toArray();
				$column_definition['type'] = $column_definition['type']->getName();
				$column_definition['nullable'] = $column_definition['notnull'] === false; // maybe add something else to determine this
				$column_definition['fillable'] = $column_definition['autoincrement'] === false &&
				!in_array($column, ['created_at', 'updated_at']); // maybe add something else to determine this
				$column_definition['required'] = $column_definition['fillable'] === true &&
				empty($column_definition['default']) && $column_definition['nullable'] === false; // maybe add something else to determine this

				$column_definition['primaryKey'] = $primary_key == $column;
				return [$column => $column_definition];
			})->values()->collapse();

			$appended_attrs = coerceAsArray($model)->only(['with', 'appends'])->flatten();

			$reflection = new ReflectionClass($model);

			$reflected_relations = new ReflectionClass(Illuminate\Database\Eloquent\Concerns\HasRelationships::class);
			$reflected_relations = collect($reflected_relations->getMethods())->map->getName();

			$model_name = get_class($model);

            $relations = collect($reflection->getMethods())->filter(function($v) use($model_name, $reflected_relations){
                if($v->class == $model_name){
	                $function_text = returnFunctionText($v);

	                $isrel = !!$reflected_relations->first(function($m) use($function_text){
		                return str_contains($function_text, '->' . $m);
	                });

	                return $isrel;
                }
            });

			$relations = $relations->pluck('name')->map(function($relation_name) use($model){
				$r = $model->{$relation_name}();
				if(!is_object( $r )) return null;
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


			return collect($attrs)->merge($relations);
		}
	}

	if(!function_exists('is_plural')){
		function is_plural($string){
			return str_plural($string) == $string;
		}
	}





