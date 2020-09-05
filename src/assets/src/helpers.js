import { clone, get, isArray, find, set, snakeCase, camelCase, kebabCase } from 'lodash';
import ReactSync from './ReactSync';
const pluralize = require('pluralize');
import { on } from './Event';
import qs from 'qs';
// import collect from 'collect.js';
import { collect } from './collect.js';


/*
class PagedCollection extends Collection{
	constructor(paginated){
		let { data, ...rest } = paginated;
		if(!isPaginated(paginated)){
			data = paginated;
		}
		else{
	        for(const k in rest){
		        def(data, k, () => rest[k]);
	//             PagedCollection.prototype[k] = rest[k];
	        }
		}

		super(data);
	}
}
*/

/** */
/*
export function collect_paged(paginated){
    // see if it is indeed a paginator

    if(isPaginated(paginated)){
//         const { data, ...rest } = paginated;

        const coll = new PagedCollection(paginated);


        return coll;
    }
    else if(Array.isArray(paginated)){
        return collect(paginated);
    }
    else return paginated;
}
*/


export function isPaginated(paginated){
    if(paginated === null || typeof paginated !== "object" || Array.isArray(paginated)) return false;

    const { current_page, last_page, per_page } = paginated || {};
    return collect([current_page, last_page, per_page]).filter().count() === 3;
}


/** */
export function fromRenderedComponent(C){
	const { type, props } = c;
	return new type(...props);
}

/** */
export function ReactSyncData(){
	window[window.ReactSyncGlobal] = window[window.ReactSyncGlobal] || {};
	return window[window.ReactSyncGlobal];
}

/** */
export function getAjaxUrl(addl_query = {}){
	const query = {...qs.parse(window.location.search), ...addl_query};
	const { protocol, hostname, pathname } = window.location;
	return `${protocol}//${hostname}${pathname}`  + '?' + qs.stringify(query);
}


/** */
export function kebab_case(t){
	var t = clone(t) || '';
	return kebabCase(t);
/*

	(t.match(/[A-Z]/g) || []).forEach((l) => { t = t.replace(l, `_${l}`) })
	return t.replace(/^_/, '').toLowerCase();
*/
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
		if(!isArray(query)) query = ['id', query];
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
		set: function(){ throw new Error('constant has been set already'); return null; }
	});
}
