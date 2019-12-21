export class Event{

	// Event System
	static events = {
		willUpdate: () => this.current_state,
		updated: () => this.current_state,
		countries_loading: () => this.current_state,
	}



	static on(event_handle, callback){
		Event.registeredEventHandlers[event_handle] = Event.registeredEventHandlers[event_handle] || [];
		Event.registeredEventHandlers[event_handle].push(callback);
	}

	static dispatch(event_handle, ...addl_args){
		const handlers = Event.registeredEventHandlers[event_handle] || [];
		const resp = handlers.map(cb => cb.apply(Event, addl_args));
		return resp;
	}

}

Event.registeredEventHandlers = {};

export function on(event_handle, callback){
	return Event.on(event_handle, callback);
}

export function dispatch(event_handle, ...addl_args){
	return Event.dispatch(event_handle, ...addl_args);
}


export default Event;
