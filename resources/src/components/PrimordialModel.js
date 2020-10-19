import React, { Component } from 'react';

import { pluralToClassName, classNameToPlural, isModel, studly_case, app_put, app_get } from './helpers';
const pluralize = require('pluralize');

/** */
class PrimordialModel{

	/** */
	constructor(props, model_type){
		this.props = props;
		this.model_type = model_type;
		const existing = this.constructor.instances[PrimordialModel.storage_key(this.props.id, this.model_type)];
		if(existing){
			existing.setProps(this.props);
		}
		else{
			this.constructor.instances[PrimordialModel.storage_key(this.props.id, this.model_type)] = this;
		}
	}

	/** */
	static storage_key(id, model_type){
		return model_type.plural + id;
	}

	/** */
	setProps(new_props, callback){
		this.props = {...this.props, ...new_props};
		if(callback){
			callback(this.props);
		}
	}

	/** */
	evolve(){
		const M = this.model_type;
		return <M {...this.props}>{this.props.children || []}</M>;
	}

	/** */
	render(){
		debugger
		return this.evolve();
	}
}

/** */
PrimordialModel.instances = {};

export default PrimordialModel;
