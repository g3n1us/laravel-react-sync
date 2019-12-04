import React from 'react';
import ReactDOM from 'react-dom';
import Trait from './Trait';
import { get, camelCase, snakeCase } from 'lodash';
import { app_get, snake_case } from '../helpers';
import Shell from '../Shell';

window.Find = (dotstring) => get(ReactSyncAppData.page_data.state, dotstring);
/**
@kind mixin
@extends Trait
*/
class Queryable extends Trait{

	constructor(targetClass){
		super(targetClass);
	}

/**
 * (STATIC) - Query the data store and return the model with the supplied id
 * @static
 */
	static find(id){
		return Find(`${this.plural}.${id}`);
	}


/**
 * (STATIC) - TODO -- Work in Progress -- DO NOT USE
 * @static
 */
	static where(a,b,c){
		// WIP!!!
		let query = [].slice.call(arguments);

		this.refresher = React.createRef();
		/*
		return <RefreshableAsync ref={this.refresher} refresh_path={`/api/${this.plural}/`} then={d => {
		let els = d.data.map((e) => {
		let ThisModel = this;
		return <ThisModel {...e} key={`_${this.plural}_${e.id}`} />
		});
		return <div>{els}</div>
		}} />
		*/
	}


	/**
	 * (STATIC) - Return all models from the data store
	 * @static
	 */


	static list(additional_props = {}){
		return <Shell url={`/api/${this.plural}`} Model={this} {...additional_props} />
	}


	static all(additional_props = {}){
		this.refresher = React.createRef();
		const plural = this.plural;
		let items = app_get('state.'+plural) || app_get('state.'+ snakeCase(plural)) || app_get(plural) || app_get(snakeCase(plural));
//debugger
		if(!items) return null;
		if(!('map' in items)) items = items.data;
        let els = items.map(e => {
			let props = {...e, ...additional_props};
			let ThisModel = this;
			return <ThisModel refresher={this.refresher} key={`${plural}${e.id}`} {...props} />;
        });

		return <>{els}</>
	}

	static firstWhere(additional_props = {}){
		let ThisModel = this;
		let props = {...this.props, ...additional_props};
		return <ThisModel refresher={this.refresher} key={`${this.plural}${this.props.id}`} {...props} />;
	}

	static first(additional_props = {}){
		this.refresher = React.createRef();
		let e = app_get(this.plural)[0];
		let props = {...e, ...additional_props};
		let ThisModel = this;
		return <ThisModel refresher={this.refresher} key={`${this.plural}${e.id}`} {...props} />;
	}


	/**
	 */


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


	static create_path = `/${this.plural}`;


	/**
	 * Store the model's state back to the database
	 */
	static create(initialProps = {}){
		const react_sync_instance = window[window.ReactSyncGlobal];
		axios.post(this.create_path, initialProps)
			.then(response => {
				if(window.location.href != response.request.responseURL){
					react_sync_instance.components.forEach(function(component){
						history.pushState(response.data, "", response.request.responseURL);
						component.setState(response.data);
					});

					react_sync_instance.page_data = response.data;

				}
				else{
					this.refresh_static();
				}

				react_sync_notification('Saved');
			})
			.catch(err => {
				console.error(err);
				react_sync_notification({text: 'An error occurred', level: 'danger'});
			});
	}

	/**
	 * Create a new model instance and store it to the database
	 * @todo complete this method
	 */
/*
	static create_static(initialProps = {}){
		return axios.post(`/${this.plural}`, initialProps)
			.then(data => {
				this.refresh_static();
				react_sync_notification('Created');
			})
			.catch(err => {
				react_sync_notification({text: 'An error occurred', level: 'danger'});
			});
	}
*/

	get delete_path(){
		return `/api/${this.singular}/${this.id}`;
	}

	/**
	 * Delete a model
	 */
	delete(){
		const react_sync_instance = window[window.ReactSyncGlobal];
		axios.delete(this.delete_path)
			.then(response => {
				if(window.location.href != response.request.responseURL){
					react_sync_instance.components.forEach(function(component){
						history.pushState(response.data, "", response.request.responseURL);
						component.setState(response.data);
					});

					react_sync_instance.page_data = response.data;
				}
				else{
					this.refresh();
				}

				react_sync_notification('Deleted');
			})
			.catch(err => {
				console.log(err);
				react_sync_notification({text: 'An error occurred', level: 'danger'});
			});
	}



	static refresh_static(){
		window.ReactSyncAppData.update();
	}



	refresh(redirectEndpoint){
		Shell.cache = {};
		window.ReactSyncAppData.update();
	}

}

export default Queryable;
