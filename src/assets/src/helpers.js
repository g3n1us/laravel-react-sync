import { clone, get, isArray, find, set, snakeCase, camelCase } from 'lodash';
import ReactSync from './ReactSync';
const pluralize = require('pluralize');
import { on } from './Event';


/** */
export function ReactSyncData(){
	window[window.ReactSyncGlobal] = window[window.ReactSyncGlobal] || {};
	return window[window.ReactSyncGlobal];
}


/** */
export function snake_case(t){
	var t = clone(t) || '';
	return snakeCase(t);
/*

	(t.match(/[A-Z]/g) || []).forEach((l) => { t = t.replace(l, `_${l}`) })

	return t.replace(/^_/, '').toLowerCase();
*/
}

/** */
export function studly_case(t){
	var t = clone(t) || '';
	const camelized = camelCase(t);

	return camelized.slice(0,1).toUpperCase() + camelized.slice(1);
}

/** */
export function app_get(dotvalue, query){
	const ReactSyncAppData = ReactSyncData();
	if(typeof dotvalue === 'undefined' && typeof query === 'undefined'){
		return ReactSyncAppData.page_data;
	}
	let parentobjkey = dotvalue.split('.').slice(0,-1).join('.');
	let possible_id = dotvalue.split('.').slice(-1).toString();
	let parentarray;
	let data;
	if(typeof query === 'undefined' && possible_id !== "null" && isArray(ReactSyncAppData.page_data[parentobjkey])){
		return app_get(parentobjkey, possible_id);
	}
	data = get(ReactSyncAppData.page_data, dotvalue);

	if(query) {
		if(!isArray(query)) query = ['id', parseInt(query)];
		return find(data, query);
	}
	else return data;
}

window.appGet = app_get;

/** */
export function app_put(dotkey, value){
	const ReactSyncAppData = ReactSyncData();
	set(ReactSyncAppData.page_data, dotkey, value);
	return app_get(dotkey);
}

/** */
export function brackets_to_dots(value){
	return value.replace(/\[(.*?)\]/g, ".$1");
}

/** */
export function pluralToClassName(plural){
	return studly_case(pluralize.singular(plural));
};

/** */
export function classNameToPlural(class_name){
	return snake_case(pluralize(class_name));
}

/** */
export function isModel(n){
	return typeof schemas[n] !== "undefined";
}


/** */
export function app_current(){
	return new Promise((resolve, reject) => {
		on('react_sync_booted', resolve);
	});
}

/** */
export function def(obj, prop, callback){
	Object.defineProperty(obj, prop, {
		get: callback,
		set: function(){ return null; }
	});
}
