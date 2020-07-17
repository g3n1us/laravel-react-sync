import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactSync from './ReactSync';
import { Model, Page } from './components';

import { snake_case, studly_case } from './helpers';
// import * as pages from 'pages';

// import * as models from 'models';

import collect from 'collect.js';



export default function Reducer(){
	const models = Model.models;

	const pages = Page.pages;

	const ReactSyncInstance = new ReactSync;

	ReactSyncInstance.boot({pages: pages});

	const { state = {} } = ReactSyncInstance.page_data;

	if(_.isEmpty(state)) return null;

	const model_map = Object.values(models).reduce((accumulator, v) => {
		accumulator[v.plural] = v;
		accumulator[snake_case(v.plural)] = v;
		accumulator[studly_case(v.plural)] = v;
		return accumulator;
	}, {});
	const models_with_keys = Object.values(models).map(C => [C.plural, C]);

	const page_props = collect(state).map((v, i) => {

		if(model_map[i]){
			return collect(v).map(c => new model_map[i]({...c}));
		}
		else if(Array.isArray(v)){
			return collect(v);
		}

		return v;
	}).all();


	models_with_keys.forEach(tuple => {
		const [ pluralname, M ] = tuple;

		(pluralname in page_props) && page_props[pluralname].each((v, i) => {
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
