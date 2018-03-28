<script>
	
// Below is a global class that holds the application's data. These are written in from the state taken from the backend.
// This starts off the app with all the data it needs to function. 
// Additionally, making an AJAX request to the page itself returns this data. 
// There is a handler in place within the routing that returns JSON for all AJAX requests instead of the fully rendereed page. 
// This way you can always get the current state of the page easily via JS and creates a defacto API that can be used to access any application state.
	
(function(){
	
	var ReactSyncAppData = function(){
		var _this = this;
		_this.user = {!! auth()->user() ?? to_string_boolean(auth()->user()) !!};			
		_this.logged_in = typeof _this.user === "object";
		_this.user_is_admin = {!! to_string_boolean( auth()->user() ? auth()->user()->can('admin-site') : 0 ) !!};
		_this.csrf_token = '{{ csrf_token() }}';
		_this.request = {!! collect(request()) !!};
		_this.route = {!! current_route() !!};
		
		_this.__page_data = {!! $page_data !!};
	}
	window.ReactSyncAppData = new ReactSyncAppData;
	window.ReactSyncAppData.page_data = onChange(window.ReactSyncAppData.__page_data, () => save(window.ReactSyncAppData.page_data));
	console.log(window.ReactSyncAppData);
	
})();
	
</script>
