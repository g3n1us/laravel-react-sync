import { clone, get, isArray, find, set, snakeCase } from 'lodash';
const pluralize = require('pluralize');

export function ReactSyncData(){
	window[window.ReactSyncGlobal] = window[window.ReactSyncGlobal] || {};
	return window[window.ReactSyncGlobal];
}

export function snake_case(t){
	var t = clone(t) || '';
	return snakeCase(t);
/*

	(t.match(/[A-Z]/g) || []).forEach((l) => { t = t.replace(l, `_${l}`) })

	return t.replace(/^_/, '').toLowerCase();
*/
}

export function studly_case(t){
	var t = clone(t) || '';
	(t.match(/_./g) || []).forEach((l) => { t = t.replace(l, `${l.slice(1).toUpperCase()}`) });
	return t.slice(0,1).toUpperCase() + t.slice(1);
}

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

export function app_put(dotkey, value){
	const ReactSyncAppData = ReactSyncData();
	set(ReactSyncAppData.page_data, dotkey, value);
	return app_get(dotkey);
}


export function brackets_to_dots(value){
	return value.replace(/\[(.*?)\]/g, ".$1");
}

export function pluralToClassName(plural){
	// one off here. MOVE!!!
	if(plural == 'data') return 'DataPoint';
	return studly_case(pluralize.singular(plural));
};

export function classNameToPlural(class_name){
	return snake_case(pluralize(class_name));
}

export function isModel(n){
	return typeof schemas[n] !== "undefined";
}

