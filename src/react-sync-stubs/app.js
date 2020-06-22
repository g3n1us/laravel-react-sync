import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { ReactSync } from 'laravel_react_sync';
import * as pages from 'pages';
import * as models from 'models';
import { collect } from 'collect.js';

/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React, LaravelReactSync and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel + LaravelReactSync.
 */

require('./bootstrap');

/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const ReactSyncInstance = new ReactSync;
ReactSyncInstance.boot({pages: pages});

const { state = {} } = ReactSyncInstance.page_data;

const model_map = Object.values(models).reduce((accumulator, v) => {
	accumulator[v.plural] = v;
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

ReactDOM.render(<App ref={ReactSync.setAppRef} {...ReactSyncInstance.page_data} page_props={page_props} />, document.createElement('div'));
