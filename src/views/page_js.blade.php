
@all_data()

@php
$randomid = "page_context_" . rand();
@endphp
@page_context({{$randomid}})
@json_script(collect(config("react_sync")), "react_sync_config")
@json_script(get_user_abilities(), "react_sync_user_abilities")


<script>

// Below is a global class that holds the application's data. These are written in from the state taken from the backend.
// This starts off the app with all the data it needs to function.
// Additionally, making an AJAX request to the page itself returns this data.
// There is a handler in place within the routing that returns JSON for all AJAX requests instead of the fully rendereed page.
// This way you can always get the current state of the page easily via JS and creates a defacto API that can be used to access any application state.
(function(){

	//☠️☠︎☣︎☠︎☣︎☠︎☠️☠︎☣︎☠︎☣︎☠︎☠️☠︎☣︎☠︎☣︎☠︎☠️☠︎☣︎☠︎☣︎☠︎☠️☠︎☣︎☠︎☣︎☠︎☠️☠︎☣︎☠︎☣︎☠︎☠️☠︎☣︎☠︎☣︎☠︎☠️☠︎☣︎☠︎☣︎☠︎☠️

	var {{config('react_sync.global_variable_name', 'ReactSyncAppData')}} = function(){
		var _this = this;
		_this.config = JSON.parse(document.getElementById('react_sync_config').innerHTML);
		_this.user = {!! auth()->user() ?? to_string_boolean(auth()->user()) !!};
		_this.logged_in = typeof _this.user === "object";
		_this.user_can = JSON.parse(document.getElementById('react_sync_user_abilities').innerHTML);

		if(_this.logged_in){
			_this.user.can = function(ability){
				return _this.user_can[ability] === true;
			}
		}
		_this.csrf_token = '{{ csrf_token() }}';
		_this.request = {!! collect(request()) !!};
		_this.route = {!! current_route() !!};
		_this.base_url = '{{ url('/') }}';
		_this.url = function(path){
			return _this.base_url + path;
		}
		_this.api_endpoint = _this.url(_this.config.api_path);
		_this.page_data = JSON.parse(document.getElementById('{{$randomid}}').innerHTML);
		_this.components = [];
		_this.update = function(){

			return axios.get('').then(function(new_page_data){
				_this.components.forEach(function(component){
					component.setState(new_page_data.data);
				});

				_this.page_data = new_page_data.data;

				return _this.page_data;
			});
		}
	}

	window.{{config('react_sync.global_variable_name', 'ReactSyncAppData')}} = new {{config('react_sync.global_variable_name', 'ReactSyncAppData')}};

	window.ReactSyncGlobal = '{{config('react_sync.global_variable_name', 'ReactSyncAppData')}}';


	//☠️☠︎☣︎☠︎☣︎☠︎☠️☠︎☣︎☠︎☣︎☠︎☠️☠︎☣︎☠︎☣︎☠︎☠️☠︎☣︎☠︎☣︎☠︎☠️☠︎☣︎☠︎☣︎☠︎☠️☠︎☣︎☠︎☣︎☠︎☠️☠︎☣︎☠︎☣︎☠︎☠️☠︎☣︎☠︎☣︎☠︎☠️

})();

</script>
