const REACT_SYNC_DATA = window[window.ReactSyncGlobal];

export default REACT_SYNC_DATA;



export class App{
	constructor(){

	}

	get config(){
		return JSON.parse(document.getElementById('react_sync_config').innerHTML);
	}

	get user(){
		return JSON.parse(document.getElementById('react_sync_user').innerHTML);
	}
}
/*

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
		_this.schemas = JSON.parse(document.getElementById('react_sync_schemas').innerHTML);
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
*/

