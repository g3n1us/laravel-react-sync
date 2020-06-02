import React from 'react';
import Trait from './Trait';
import Shell from '../Shell';

import { studly_case } from '../../helpers';

import { difference, intersection } from 'lodash';

/** */
class Eloquent extends Trait{
	/** */
	constructor(targetClass){
		super(targetClass);
	}

	/** */
	static query_props = ['find', 'where', 'all', 'first'];

	/** */
	static pagination_props = ['per_page'];

	/** */
	static get reserved_props(){
		return [...this.query_props, ...this.pagination_props, 'order_by', 'sort_by'];
	}

	/** */
	static get_non_reserved_props(props){
		const ret = difference(Object.keys(props), this.reserved_props);
		const val = {};
		for(const i in ret){
			val[ret[i]] = props[ret[i]];
		}
		return val;
	}

	/** */
	get_non_reserved_props(){
		return this.constructor.get_non_reserved_props(this.props);
	}

	/** */
	get non_reserved_props(){
		return this.constructor.get_non_reserved_props(this.props);
	}

	/** */
	get_query_prop(){
		const i = intersection(this.constructor.query_props, Object.keys(this.props));
		return i.length ? i[0] : null;
	}

	/** */
	get query_prop(){
		return this.get_query_prop();
	}

	/** */
	get is_query(){
		return !!this.get_query_prop();
	}

	/** */
	get_query_endpoint(){
		const q = this.get_query_prop();
		let where_prop;
		if(q == 'where'){
			if(Array.isArray(this.props.where)){
				where_prop = this.props.where.join('|');
			}
			else where_prop = this.props.where;
		}
		const map = {
			find: `/api/${this.singular}/${this.props.find}`,
			where: `/api/${this.plural}/where/${where_prop}`,
			all: `/api/${this.plural}`,
			first: `/api/${this.singular}`,
		}
		const qs_object = {};
		if(this.props.per_page) qs_object.per_page = this.props.per_page;
		const qs_string = qs.stringify(qs_object);
		return map[q] + `?${qs_string}`;
	}

	/** */
	queryRender(){
		const q = this.get_query_endpoint();
		return <Shell url={q} Model={this.constructor} {...this.non_reserved_props} />
	}

	/** */
	render(){
		if(this.is_query){
			return this.queryRender();
		}

		let renderAs = this.props.renderAs || this.props.render || 'Default';
		let renderName = `render${studly_case(renderAs)}`;
		if(typeof renderAs === 'function'){
			return renderAs(this.props);
		}

		if(typeof this[renderName] === 'function'){
			return this[renderName]();
		}

		// return the default render method.
		return this.renderDefault();
	}

	/** */
	renderDebug(){
		return (<div><code>{this.constructor.name} | {this.props.id}</code></div>);
	}

}

window.Eloquent = Eloquent;

export default Eloquent;