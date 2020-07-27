import React from 'react';
import { dispatch } from './Event';
import schemas from 'js/schema';
import model_properties from 'js/model_properties';
import qs from 'qs';
import Reducer from './Reducer';
import { getAjaxUrl } from './helpers';
import axios from './fetchClient';

/** */
class ReactSync{
	/** */
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
		this.schemas = schemas;
		this.model_properties = model_properties;
		if(this.user){
			this.user.can = (ability) => this.user_can[ability] === true;
		}

	}

	static booted = false;

	initialData = null;

	/** */
	boot(data){
		if(!this.initialData){
			this.initialData = this.route.controller;
			history.replaceState(this.initialData, null, null);
		}
		ReactSync.pages = {...ReactSync.pages, ...data.pages};
		this.constructor.booted = true;
	}

	/** */
	static getInstance(){
		return new this;
	}

	/** */
	static setAppRef = reference => {
		this.appRef = {current: reference};
		dispatch('react_sync_booted', this.appRef);
	}


// 	static appRef = React.createRef();
	/** */
	static appRef = {current: null};

	/** */
	get appRef(){
		return this.constructor.appRef;
	}

	// instance property
	/** */
	components = [];

	// instance property
	/** */
	static pages = {};

	get pages(){
		return ReactSync.pages;
	}

	/** */
	get logged_in(){
		return typeof this.user === "object";
	}

	/** */
	getAjaxUrl(){
		return getAjaxUrl();
	}

	/** */
	update(callback){
		return axios.get(getAjaxUrl()).then((new_page_data) => {
			this.page_data = new_page_data.data;
			this.route.controller = new_page_data.data
			app().setState(Reducer());
			if(typeof callback === 'function'){
				callback(this.page_data);
			}
		});
	}

}


ReactSync.instance = false;

window[window.ReactSyncGlobal] = new ReactSync;

export default ReactSync;
