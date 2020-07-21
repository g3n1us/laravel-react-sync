import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactSync from './ReactSync';
import { Model, Page } from './components';

import { snake_case, studly_case, collect_paged, isPaginated } from './helpers';

import collect from 'collect.js';



export default function Reducer(){

	const models = Model.models;

	const pages = Page.pages;

	const ReactSyncInstance = new ReactSync;

	ReactSyncInstance.boot({pages: pages});

	const { state = {} } = ReactSyncInstance.page_data;

	if(_.isEmpty(state)) return null;

	const plural_model_map = Object.values(models).reduce((accumulator, v) => {
		accumulator[v.plural] = v;
		accumulator[snake_case(v.plural)] = v;
		accumulator[studly_case(v.plural)] = v;
		return accumulator;
	}, {});

	const singular_model_map = Object.values(models).reduce((accumulator, v) => {
		accumulator[v.singular] = v;
		accumulator[snake_case(v.singular)] = v;
		accumulator[studly_case(v.singular)] = v;
		return accumulator;
	}, {});

	const model_map = {...plural_model_map, ...singular_model_map};

// 	const models_with_keys = Object.values(models).map(C => [C.plural, C]);

	const page_props = collect(state).map((valueOrValues, propName) => {
		if(model_map[propName]){
    		// This is! a representation of a model or models, so turn it into one
    		if(typeof valueOrValues === "object" && valueOrValues === null) return null;

    		if(isPaginated(valueOrValues)){
        		return collect_paged(valueOrValues).map(c => new model_map[propName]({...c}));
    		}
    		else if(Array.isArray(valueOrValues)){
        		return collect(valueOrValues).map(c => new model_map[propName]({...c}));
    		}
            else if(typeof valueOrValues === "object"){
                return new model_map[propName]({...valueOrValues});
            }

		}
		else if(Array.isArray(valueOrValues)){
			return collect(valueOrValues);
		}

		return valueOrValues;
	}).all();

	Object.keys(plural_model_map).forEach(pluralname => {
		const M = plural_model_map[pluralname];

		(pluralname in page_props) && page_props[pluralname] && page_props[pluralname].each((v, i) => {
			Object.defineProperty(page_props[pluralname], v.id, {
				get: function(){
					return this.get(i);
				},
				set: function(newprops){
					const newitem = new M({...newprops});
					this.put(i, newitem);
					return newitem;
				},
			})
		});

	});


	return page_props;

}

