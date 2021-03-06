import React from 'react';
import ReactDOM from 'react-dom';
import Trait from './Trait';
import { get, camelCase, snakeCase } from 'lodash';
import { app_get, snake_case, def } from '../../helpers';
import Shell from '../Shell';
import ReactSync from '../../ReactSync';
import collect from '../../collect.js';
import axios from '../../fetchClient';
import { dispatch, on } from '../../Event.js';

const ReactSyncAppData = ReactSync.getInstance();

window.Find = (dotstring) => {
	return get(ReactSyncAppData.page_data.state, dotstring);
};



/**
@kind mixin
@extends Trait
*/
class Queryable extends Trait{

	static get repo(){
		return ReactSyncAppData.page_data.state;
	}

	static hasBeenKeyed = false;

	static setKeyed(){

	}



/**
 * (STATIC) - Query the data store and return the model with the supplied id
 * @static
 */
	static find(id){
		const { plural, repo } = this;
		const dotstring = `${plural}.${id}`;
		return app_get(dotstring);
	}


/**
 * (STATIC) -
 * @static
 */
	static where(...args){
		this.refresher = React.createRef();
		return collect(appGet(this.plural)).where(...args);
	}


	/**
	 * (STATIC) - Return all models from the data store
	 * @static
	 */


	static list(additional_props = {}){

		return <Shell url={this.plural_url} Model={this} {...additional_props} />
	}


	/** */
	static all(additional_props = {}){
    	debugger;
		this.refresher = React.createRef();
		const plural = this.plural;
		let items = app_get('state.'+plural) || app_get('state.'+ snakeCase(plural)) || app_get(plural) || app_get(snakeCase(plural));
// debugger
		if(!items) return null;
		if(!('map' in items)) items = items.data;
        let els = items.map(e => {
			let props = {...e, ...additional_props};
			let ThisModel = this;
			return <ThisModel refresher={this.refresher} key={`${plural}${e.id}`} {...props} />;
        });

		return <>{els}</>
	}

	/** */
	static firstWhere(a, b){

        return null;

		let ThisModel = this;
		let props = {...this.props, ...additional_props};
		return <ThisModel refresher={this.refresher} key={`${this.plural}${this.props.id}`} {...props} />;
	}

	/** */
	static first(additional_props = {}){
		this.refresher = React.createRef();
		const plural = this.plural;
		let items = app_get('state.'+plural) || app_get('state.'+ snakeCase(plural)) || app_get(plural) || app_get(snakeCase(plural));
		if(!items.length) return null;
		let e = items[0];
		let props = {...e, ...additional_props};
		let ThisModel = this;
		return <ThisModel refresher={this.refresher} key={`${this.plural}${e.id}`} {...props} />;
	}


	/**
	 */
	get save_path(){
		return this.api_url;
	}

	/**
	 * Store the model's state back to the database
	 */
	save(callback = false){
		const save_path = 	this.save_path || this.calculatedProperties.api_url;
		axios.put(save_path, this.filterMutable(this.state))
			.then(response => {
				this.refresh();
				react_sync_notification('Saved');
				if(callback) callback();
			})
			.catch(err => {
				console.error(err);
				react_sync_notification({text: 'An error occurred', level: 'danger'});
			});
	}


	/** */
	static get create_path(){
		return this.plural_url;
	}



	/**
	 * Create a new model and insert into the database
	 */
	static create(initialProps = {}){
    	return new Promise((resolve, reject) => {
    		axios.post(this.create_path, initialProps)
    			.then(response => {
        			const redirect_url = this.response_is_redirect(response);

    				if(redirect_url){
    					history.pushState(response.data, "", redirect_url);
    					this.refresh_static();
    				}
    				else{
    					this.refresh_static();
    				}

    				react_sync_notification('Saved');

    				resolve(response.data);

    				dispatch('model_created', new this(response.data));
    			})
    			.catch(err => {
    				console.error(err);
    				react_sync_notification({text: 'An error occurred', level: 'danger'});
    				reject(err);
    			});

    	});
	}

	/**
	 * Create a new model instance and store it to the database
	 * @todo complete this method
	 */


	/** */
	get delete_path(){

		return this.api_url;
	}

	/**
	 * Delete a model
	 */
	delete(callback = false){
    	return new Promise((resolve, reject) => {
    		axios.delete(this.delete_path)
    			.then(response => {
        			const redirect_url = this.constructor.response_is_redirect(response);
    				if(redirect_url){
    					history.pushState(response.data, "", redirect_url);
    					this.refresh();
    				}
    				else{
    					this.refresh();
    				}

    				react_sync_notification('Deleted');
    				dispatch('model_deleted', response);
    				resolve(response);
    				if(typeof callback === 'function'){
	    				callback(response);
    				}

    			})
    			.catch(err => {
    				console.log(err);
    				react_sync_notification({text: 'An error occurred', level: 'danger'});
    				reject(err);
    			});
			});
	}


	/** */
	static refresh_static(){
		Shell.cache = {};
		ReactSync.getInstance().update();
	}


	/** */
	refresh(){
		Shell.cache = {};

		if(this.props.refresh) this.props.refresh()
		else{
			ReactSync.getInstance().update();
		}

	}

    static response_is_redirect(response){
    	const { href } = window.location;
    	const { responseURL } = response.request;
    	const { url } = response.config;
    	console.log(url, responseURL);
    	if(responseURL !== url && href !== responseURL){
        	return responseURL;
    	}
    	return false;
    }



}


export default Queryable;
