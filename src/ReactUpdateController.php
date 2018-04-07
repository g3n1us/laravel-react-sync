<?php

namespace G3n1us\LaravelReactSync;

use App\User;
use Illuminate\Database\Eloquent\Relations\Relation;

use Illuminate\Http\Request;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;


class ReactUpdateController extends BaseController
{
	use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
	
	protected $model;
	
	protected $model_ns_string;
	
	protected $model_classname;
	
	protected $id;
	
	
    /**
     * Show the profile for the given user.
     *
     * @param  int  $id
     * @return Response
     */
	public function __construct(ReactRequest $request){
		// TODO set up middleware that adapts to non-admin updates
		$this->middleware('can:admin-site');

	}

	public function test(ReactRequest $request){
		dd('sdfsdf');
	}

	private function boot(ReactRequest $request){
		$this->model_classname = $model_classname = $request->input('model_classname');
		if(empty($this->model_classname)){
			throw new \Exception("Your request must include the parameter: 'model_classname' which is the string representation of the model name");
		}
		$this->model_ns_string = "\\App\\$model_classname";
		
		
		$this->id = array_get($request, 'id');
		if($this->id)
			$this->model = $this->model_ns_string::findOrFail($this->id); // TODO allow for global constraints! maybe a paramater that ignores the constraints??
		else
			$this->model = new $this->model_ns_string;
	}
	
	// Delete a model, this is called for a DELETE request	
	public function delete(ReactRequest $request){
		$this->boot($request);

		$this->model->delete();
		return $this->model_ns_string::find($this->id);		
	}
	
	// Create a new model, this is called for a PUT request
	public function create(ReactRequest $request){
		$this->boot($request);
		
		$input_arr = $this->normalizeRequest($request);	
		return $this->model_ns_string::create($input_arr);
	}
	
	public function save(ReactRequest $request){
		$this->boot($request);
		$input_arr = $this->normalizeRequest($request);

		foreach($input_arr as $prop => $value){
	        // This is a method or property of the model
	        // So find out if it is a relation or a property
	        // This is a method, so it could be a relation. Handle this scenario...
	        if(method_exists($this->model, $prop)){
		        
		        $model_method = $this->model->{$prop}();

		        if( $model_method instanceOf Relation ){
			        // It is a relation, find out which kind
			        $class_basename = class_basename($model_method);

			        if(method_exists($this, "resolve$class_basename")){
				        $this->{"resolve$class_basename"}($prop, $value);
			        }
			        else{
				        throw new \Exception("The property you are setting is a relation that is not currently supported.");
			        }
		        }
		        else{
			        throw new \Exception("You are attempting to set a property that is callable, but is not a Relation.");
		        }
		        
	        }
	        else if(array_key_exists($prop, $this->model->getAttributes())){
		       $this->model->{$prop} = $value;
	        }
	        else if(array_key_exists(head(explode('->', $prop)), $this->model->getAttributes())){
		       $this->model->{$prop} = $value;
	        }

		}
        $this->model->save();
        		
		return $this->model_ns_string::withoutGlobalScopes()->findOrFail($this->id);
	}
    
	
	
	private function resolveBelongsToMany($prop, $value){
		// Since this is a BelongsToMany relationship, use the sync method to set the exact value to the model.
		// This will remove any existing related models and set only those with the ids set here.
		// Let's check first that we have an array of integers 
		if(!is_array($value)){
			throw new \Exception('The value for a "Many to Many" relation must be an array.');
		}

		// If this is an array of models, pluck the id. Otherwise it should be an array of integers(model ids)
		if(!empty($value) && is_object($value[0])){
			$value = array_pluck($value, 'id');
		}

		$this->model->{$prop}()->sync($value);
		return $this->model;
	}
	
	
	
	
	private function resolveBelongsTo($prop, $value){
		if(is_null($value)){
			$this->model->{$prop}()->dissociate();
			return $this->model;
		}
		if(is_numeric($value)){
			$value = $this->model->find($value);
		}
		if($value instanceOf Model){
			throw new \Exception("The model that is being associated cannot be found");
		}
		
		$this->model->{$prop}()->associate($value);
		return $this->model;

	}	
	
	
	
	private function resolveHasMany($prop, $value){
		die('sdfsdfsdfsdf');
		// Since this is a hasMany relationship, use the ...
		// 
		// See documentation for mass assignment!! This has to be enabled on the model to which you are saving data. 
		if(is_array($value)){ // always gonna be an array isn't it :(
			// Save all new relations
			dd($value);
			$this->model->{$prop}()->createMany($value);		
		}
		else{
			$this->model->{$prop}()->create($value);		
		}
		dd($this->model->{$prop});
		$this->model->{$prop}()->sync($value);
		dd($this->model);
		return $this->model;
	}
	
	
	
	
	
	private function normalizeRequest(ReactRequest $request){
		// remove fields that should never be editable
		$input_arr = array_except($request->all(), ['id', 'modelname', 'model_classname', 'created_at', 'updated_at', '_method']);

		// find JSON setters, (key includes ->), this means that it is intended to set a nested value inside a JSON database field.
		// Then convert it to a standard value to accomodate the weird thing that is happening in React -- see SB!
		
		$json_setters = array_where($input_arr, function($v, $k){
			return str_contains($k, '->');
		});
		$json_setters = array_map(function($v){
			$v = is_array($v) ? last($v) : $v;
			// coerce string booleans into real ones
			if(in_array($v, ["true", "false"]))
				$v = $v === "true";
			return $v;
		}, $json_setters);
		
		
		// remove these from $input_arr
		$input_arr = array_except($input_arr, array_keys($json_setters));
		// Now, we need to remove the JSON fields that will be set via the setters above.
		$json_setter_keys = array_unique(
			array_map(function($k){
				return head(explode('->', $k));
			}, array_keys($json_setters))
		);
		
		// Remove the JSON items and put the setters back in
		$input_arr = array_except($input_arr, $json_setter_keys) + $json_setters;
		
		// Lastly, return only fillable items
		$input_arr = array_where($input_arr, function($v, $k){
			return $this->model->isFillable($k) || $this->model->isFillable(head(explode('->', $k)));
		});

		return $input_arr;
	}	
}





