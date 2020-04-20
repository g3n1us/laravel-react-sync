import React from 'react';
import { dispatch } from './Event';

export default class ReactSync{
	constructor(){
		if(ReactSync.instance) return ReactSync.instance;
		ReactSync.instance = this;

		const script_tags = document.querySelectorAll('[data-react_sync_data="true"]');
		script_tags.forEach(t => {
			const identifier = t.id.replace('react_sync_', '');
			if(identifier.match(/^page_context.*?$/)){
				this.page_data = JSON.parse(t.innerHTML);
			}
			else if(identifier === 'basedata'){
				const mult = JSON.parse(t.innerHTML);
				for(const i in mult) this[i] = mult[i];
			}
			else{
				if(typeof this[identifier] !== 'undefined'){
					console.log(identifier + ' already set');
				}
				else{
					this[identifier] = JSON.parse(t.innerHTML);
				}
			}
		});

		if(this.user){
			this.user.can = (ability) => this.user_can[ability] === true;
		}
		
		
	}

	boot(data){
		ReactSync.pages = {...ReactSync.pages, ...data.pages};
	}

	static setAppRef = reference => {
		this.appRef = {current: reference};
		dispatch('react_sync_booted', this.appRef);
	}


// 	static appRef = React.createRef();
	static appRef = {current: null};

	get appRef(){
		return this.constructor.appRef;
	}

	// instance property
	components = [];

	// instance property
	static pages = {};

	get logged_in(){
		return typeof this.user === "object";
	}

	update(callback){
		return axios.get('').then((new_page_data) => {
			this.components.forEach(function(component){
				component.setState(new_page_data.data);
			});

			this.page_data = new_page_data.data;
			if(typeof callback === 'function'){
				callback(this.page_data);
			}
		});
	}

}


ReactSync.instance = false;

window[window.ReactSyncGlobal] = new ReactSync;
