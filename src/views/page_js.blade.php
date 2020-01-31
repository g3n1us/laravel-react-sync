
@all_data()

@php
$randomid = "page_context_" . rand();
$basedata = collect([
	"config" => collect(config("react_sync")),
	"schemas" => get_schemas(),
	"user" => auth()->user() ?? false,
	"user_abilities" => get_user_abilities(),
	"route" => current_route(),
	"request" => client_side_safe_request(),
	"base_url" => url('/'),
	"csrf_token" => csrf_token(),
]);

@endphp

@page_context({{$randomid}})
@json_script($basedata, "react_sync_basedata")


<script>

// Below is a global class that holds the application's data. These are written in from the state taken from the backend.
// This starts off the app with all the data it needs to function.
// Additionally, making an AJAX request to the page itself returns this data.
// There is a handler in place within the routing that returns JSON for all AJAX requests instead of the fully rendereed page.
// This way you can always get the current state of the page easily via JS and creates a defacto API that can be used to access any application state.
(function(){

	//☠️☠︎☣︎☠︎☣︎☠︎☠️☠︎☣︎☠︎☣︎☠︎☠️☠︎☣︎☠︎☣︎☠︎☠️☠︎☣︎☠︎☣︎☠︎☠️☠︎☣︎☠︎☣︎☠︎☠️☠︎☣︎☠︎☣︎☠︎☠️☠︎☣︎☠︎☣︎☠︎☠️☠︎☣︎☠︎☣︎☠︎☠️

	window.{{config('react_sync.global_variable_name', 'ReactSyncAppData')}} = null;

	window.ReactSyncGlobal = '{{config('react_sync.global_variable_name', 'ReactSyncAppData')}}';

	//☠️☠︎☣︎☠︎☣︎☠︎☠️☠︎☣︎☠︎☣︎☠︎☠️☠︎☣︎☠︎☣︎☠︎☠️☠︎☣︎☠︎☣︎☠︎☠️☠︎☣︎☠︎☣︎☠︎☠️☠︎☣︎☠︎☣︎☠︎☠️☠︎☣︎☠︎☣︎☠︎☠️☠︎☣︎☠︎☣︎☠︎☠️

})();

</script>
