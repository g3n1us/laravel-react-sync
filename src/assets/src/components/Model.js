import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import collect from '../collect.js';
import axios from '../fetchClient';
import Field from './Field';
import qs from 'qs';
// import PrimordialModel from './PrimordialModel';

// Import traits
import Queryable from './traits/Queryable';
import HasReflection from './traits/HasReflection';
import HasRelations from './traits/HasRelations';
import RenderableAsBasicForm from './traits/RenderableAsBasicForm';
import RenderableAsDiagram from './traits/RenderableAsDiagram';
import RenderableDefault from './traits/RenderableDefault';
import HasKeyProp from './traits/HasKeyProp';
import Eloquent from './traits/Eloquent';
import MorphsDates from './traits/MorphsDates';

import Shell from './Shell';

import ReactSync from '../ReactSync';

import { pluralToClassName, classNameToPlural, isModel, studly_case, app_put, app_get, def } from '../helpers';
const pluralize = require('pluralize');

import { filter, flatten, isEmpty, toPairs, pick, kebabCase, snakeCase, difference, intersection } from 'lodash';

/**
  @extends Component
  @mixes Queryable
  @mixes HasReflection
  @mixes HasKeyProp
  @mixes HasRelations
  @mixes RenderableAsBasicForm
  @mixes RenderableAsDiagram
*/
class Model extends Component{

	static get defaultProps(){
		let defaultProps = {
			id: null,
			created_at: null,
			updated_at: null,
		}
		return defaultProps;
	}




/**
  @constructor
  @argument {Object} props An object representing a single model
*/
  constructor(props){

    super(props);

//     if(props === null) debugger

    this.getDates();

    Model.addModel(this.constructor);

	if(!app_get(this.plural)){
		app_put(this.plural, {});
	}

	const res = app_put(`${this.plural}.${this.id}`, this);


    this._calculatedProperties = {
		endpoint: `${window.location.protocol}//${window.location.hostname}/${this.constructor.plural}`,
		api_url: `${window.location.protocol}//${window.location.hostname}/api/${this.singular}/${this.props.id}`,
		url: `${window.location.protocol}//${window.location.hostname}/${this.constructor.singular}/${this.props.id}`,
    };

    this.state = this.mutableState;

	let relations = filter(toPairs(this.schema), (v) => v[1].type == "relation");
	this.relations = {};

	relations.forEach((v_array) => {
		let [ relationName, relationDefinition ] = v_array;
		const { relation_type, definition } = relationDefinition;
		if(relationName in this.props){
			const relationValue = this.props[relationName];
			const class_name = pluralToClassName(relationName);
			const ThisModel = Model.getModel(class_name);
			let relationValueModels = null;
			if(relationValue && ('map' in relationValue)) {
				if(definition.withDefault && isEmpty(relationValue)){
					relationValue.push({});
				}
				relationValueModels = relationValue.map((i, index) => {
					return ThisModel ? new ThisModel({key: `${index}${class_name}${i.id}`, ...i}) : i;
				});
				relationValueModels = collect(relationValueModels);
			}
			else {
				if(definition.withDefault && isEmpty(relationValue)){
					relationValueModels = new ThisModel;
				}
				else{
    				if(isEmpty(relationValue)) relationValueModels = null;
    				else relationValueModels = ThisModel ? new ThisModel(relationValue) : relationValue;
				}
			}
			if(relationValueModels){
				def(this, relationName, () => relationValueModels);
				def(this.relations, relationName, () => relationValueModels);
			}

		}
		else {

			if(typeof this[relation_type] !== 'function'){
				console.error(relation_type, 'this[relation_type]');
			}
			else{
				def(this, relationName, () => this[relation_type](definition));
				def(this.relations, relationName, () => this[relation_type](definition));
			}
			}
		});

		this.constructor.boot(this);

	}

	/** */
	hydrate(){
		return new Promise((resolve, reject) => {
			if(this.props.id && Object.keys(this.props).length === 1){
				axios.get(this.api_url).then(response => {
					return resolve(new this.constructor(response.data));
				});
			}
			else{
				return resolve(this);
			}
		});
	}

	/** */
	set_render(render_name){
		const fn = this.props.set_render;

	}

	/** */
	static getPrimaryKey(){
		return  this.getModelProperties().primaryKey;
	}

	/** */
	get primaryKey(){
		return this.constructor.getPrimaryKey();
	}

	/** */
	get id(){
		return '' + this.props[this.primaryKey];
	}

	/** */
	static get editable_props(){
		return [];
	}

	/** */
	get calculatedProperties(){
		return this._calculatedProperties;
	}

    /** */
	static getModelProperties(){
        return ReactSync.getInstance().model_properties[this.name];
	}

	/** */
	get model_properties(){
		return this.constructor.getModelProperties();
	}


	/** */
	static getSchema(){
		return ReactSync.getInstance().schemas[this.name];
	}

	/** */
	get schema(){
		return this.constructor.getSchema();
	}

	/** */
	get url(){
		return this._calculatedProperties.url;
	}

	/** */
	get api_url(){
		return this._calculatedProperties.api_url;
	}

	/** */
	get breadcrumb(){
		let a = document.createElement('a');
		a.href = this._calculatedProperties.url;
		let segments = filter(a.pathname.split('/'));
		let joined = [];
		const reducer = (accumulator, currentValue) => {
			accumulator.push(flatten([...accumulator, currentValue]));
			return accumulator;
		}
		return segments.reduce(reducer, [[]])
			.map(s => `${window.location.protocol}//${window.location.hostname}/${s.join('/')}`);
	}

	/**
	  @todo Implement this as a way to add instantiation items
	*/
	static boot(instance){
		//
	}

	/** */
	filterMutable(objectToFilter){
		// if(!this.constructor.editable_props.length) return objectToFilter;
		return pick(objectToFilter, this.constructor.editable_props);
	}


	/** */
	get mutableState(){
		return this.filterMutable(this.props);
	}


	/** */
	get plural(){
		return this.constructor.plural;
	}


	/** */
	static get plural(){
		return pluralize(kebabCase(this.name));
	}

	/** */
	get singular(){
		return this.constructor.singular;
	}


	/** */
	static get singular(){
		return pluralize.singular(this.plural);
	}

}

new RenderableAsBasicForm(Model);

new RenderableAsDiagram(Model);

new RenderableDefault(Model);

new HasReflection(Model);

new HasRelations(Model);

new HasKeyProp(Model);

new Queryable(Model);

new Eloquent(Model);

new MorphsDates(Model);


(function(){
	/** */
	Model.addModel = function(M){
		Model.models = Model.models || {};
		if(!(M.name in Model.models))
			Model.models[M.name] = M;
	}

	/** */
	Model.getModel = function(M){
		Model.models = Model.models || {};
		const Mname = typeof M === 'string' ? M : M.name;
		return Model.models[Mname];
	}

	/** */
	Model.allModels = function(){
		Model.models = Model.models || {};
		return Model.models;
	}

	/** */
	Model.getRegex = function(){
		const models = collect(Model.allModels());
		if(!models.count()){
			return false;
		}
		const slugs = models.map((v, k) => {
				return [
					k,
					kebabCase(k),
					snakeCase(k),
					pluralize(k),
					v.plural,
					pluralize(kebabCase(k)),
					pluralize(snakeCase(k)),
				];
			})
			.values()
			.collapse()
			.unique()
			.implode('|');

		const regex_string = `/(${slugs})/?([0-9]*?)$`;
		return new RegExp(regex_string, 'i')
	};

	Model.getRegex();

	/** */
	Model.matchUrlPath = function(){
		const regex = Model.getRegex();
		if(!regex){
			return false;
		}
		let path = window.location.pathname;
		if(path.slice(-1) === '/'){
			path = path.slice(0, -1);
		}
		const match_array = window.location.pathname.match(regex);
		if(!match_array){
			return false;
		}
		return Array.from(match_array);
	}

	collect().macro('hydrate', function(){
		return new Promise((resolve, reject) => {
			const needs_hydration = this.filter(i => typeof i !== 'object');
			if(needs_hydration.isEmpty()){
				return resolve(this);
			}
			const _promises = this.items.map(i => {
				if(typeof i !== 'object'){
					return (new this.model({id: i})).hydrate();
				}
				return i;
			});
			Promise.all(_promises)
				.then(x => {
					this.items = x;
					return resolve(this);
				});
		});
	});

	collect().macro('promise', function(){
		return new Promise((resolve, reject) => {
			Promise.all(Object.values(this.items))
				.then(values => {
					this.items = values;
					resolve(this);
				});
		});
	});

	/** */
	Model.extractInstancesFromUrl = function(){
		let matches = Model.matchUrlPath();
		const return_val = {
			models: [],
			instances: {},
		}


		if(!matches){
			return_val.models = collect(return_val.models);
			return_val.instances = collect(return_val.instances);
			return return_val;
		}
		matches = collect(matches).filter().all();
		const model_name = pluralToClassName(matches[1]);
		const M = Model.getModel(model_name);
		if(!M){
			return resolve(return_val);
		}
		const plural = M.plural;
		return_val.models.push(M);
		return_val.instances[plural] = return_val.instances[plural] || [];
		if(matches.length === 3){
			return_val.instances[plural].push(matches[2]);
		}
		return_val.models = collect(return_val.models);
		return_val.instances = collect(return_val.instances);
		return_val.instances = return_val.instances.map((v, k) => {
			const M = Model.getModel(pluralToClassName(k));
			const coll = collect(v);
			coll.model = M;

			return coll.hydrate();
		});

		return return_val;
	}


	/** */
	Model.resolveInstancesFromUrl = function(return_val){
		return new Promise((resolve, reject) => {
			return_val.instances.promise().then((r) => {
				return_val.instances = return_val.instances.keyBy('model.plural').all();
				return resolve(return_val);
			});
		});
	}

/*
	Model.modifyInstance = function(instance, newProps){
		const M = instance.type;
		const resolved_props = {...instance.props, ...newProps};
		return <M {...resolved_props} />;
	}
*/

})();

export default Model;

