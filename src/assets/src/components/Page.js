import React, { Component } from 'react';
import Event from '../Event';
import axios from 'axios';
const { on } = Event;
import PageShell from './PageShell';

import ReactSync from '../ReactSync';

import Eloquent from './traits/Eloquent';

import { studly_case, kebab_case } from '../helpers';


/** */
class Page extends Component{
	/** */
	constructor(props){
		super(props);
		const { components, page_data, pages } = new ReactSync;
		components.push(this);

		ReactSync.pages[this.constructor.name] = this.constructor;
	}

	/** */
	componentDidMount(){
		on('refresh-state', (e) => {
			this.setState(REACT_SYNC_DATA.page_data);
		});
	}

	/** */
	refresh(callback = () => {}){
		const request_options = {
			headers: {'X-IsAjax': 'true', 'X-Requested-With': 'XMLHttpRequest'},
		}
		return axios.get(window.location.href, request_options).then((new_page_data) => {
			const AppRef = ReactSync.appRef.current;
			(AppRef || this).setState(new_page_data.data, callback);
		});
	}

	/** */
	getPageComponentFromPath(path = window.location.pathname){
    	if(path.slice(-1) != '/') path = `${path}/`;
    	const prefix = (new ReactSync).config.pages_prefix;
    	const r = new RegExp(`\\${prefix}\\/(.*?)\\/.*?$`);
    	const matches = path.match(r);
    	const possiblePage = matches && matches.length > 1 && matches[1];
// 		const possiblePage = path.replace(prefix + '/', '');
		const possiblePageName = studly_case(possiblePage) + 'Page';
		return ReactSync.pages[possiblePageName];
	}

	/** */
	renderDefault(){
		console.log('Page.js renderDefault is called');
		const P = this.getPageComponentFromPath();
		return (
			<PageShell Page={P} />
		)
	}

	/** */
	renderNavLink(){
		const human_name = this.constructor.name.slice(0, -4);
		const path = kebab_case(this.constructor.name.slice(0, -4));
		const prefix = (new ReactSync).config.pages_prefix;
		const link = `${prefix}/${path}`;
		return (
			<a key={`NavLink${link}`} href={link} className="nav-link">{human_name}</a>
		);
	}

	/** */
	get is_query(){
		return !(Object.keys(this.props).length);
	}

	/** */
	queryRender(){
		const P = this.getPageComponentFromPath();
		return (
			<PageShell Page={P} />
		)
	}


}


export default Page;

window.Page = Page;

Eloquent.applyTo(Page);
