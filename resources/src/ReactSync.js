import React from 'react';
import ReactDOM from 'react-dom';

import { dispatch } from './Event';
import schemas from 'js/schema';
import model_properties from 'js/model_properties';
import qs from 'qs';
import Reducer from './Reducer';
import { getAjaxUrl } from './helpers';
import axios from './fetchClient';
import App from './App.js';
import { Model, Page } from './components';

/** */
class ReactSync{

	page_data = null;

	/** */
	constructor(){
		if(ReactSync.instance) return ReactSync.instance;
		ReactSync.instance = this;

		const script_tags = document.querySelectorAll('[data-react_sync_data="true"]');
		if(!script_tags.length){
			throw new Error("The ReactSync Blade directive is missing. Add '@include('react_sync::page_js')' to the <head /> of your template.");
		}

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

	static getInstance(){
		return new this;
	}

	static booted = false;

	initialData = null;

	/** */
	boot(){
		if(this.constructor.booted) return;

		if(!this.initialData){
			this.initialData = this.route.controller;
			history.replaceState(this.initialData, null, null);
		}
		ReactSync.pages = this.pages;
		ReactSync.models = this.models;
		Page.pages = this.pages;
		Model.models = this.models;

		this.constructor.booted = true;

		return this;
	}

	/** */
	render(){
		this.boot();
		ReactDOM.render(<App ref={ReactSync.setAppRef} {...this.page_data} />, document.createElement('div'));
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
		return require('pages');
	}

	/** */
	static models = {};

	get models(){
		return require('models');
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
			const fromReducer = Reducer();
			App.app().setState(fromReducer);
			if(typeof callback === 'function'){
				callback(fromReducer);
			}
		});
	}

}


ReactSync.instance = false;

if(window.ReactSyncGlobal){
	window[window.ReactSyncGlobal] = new ReactSync;
}

export default ReactSync;
