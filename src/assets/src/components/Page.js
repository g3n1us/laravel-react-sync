import React, { Component } from 'react';
import Event from '../Event';
import axios from 'axios';
const { on } = Event;
import PageShell from './PageShell';

import ReactSync from '../ReactSync';

import Eloquent from './traits/Eloquent';

import { studly_case } from '../helpers';


export default class Page extends Component{
	constructor(props){
		super(props);
		const { components, page_data, pages } = new ReactSync;
		components.push(this);
		ReactSync.pages[this.constructor.name] = this.constructor;
	}

	componentDidMount(){
		on('refresh-state', (e) => {
			this.setState(REACT_SYNC_DATA.page_data);
		});
	}

	refresh(callback = () => {}){
		const request_options = {
			headers: {'X-IsAjax': 'true', 'X-Requested-With': 'XMLHttpRequest'},
		}
		return axios.get(window.location.href, request_options).then((new_page_data) => {
			const AppRef = ReactSync.appRef.current;
			(AppRef || this).setState(new_page_data.data, callback);
		});
	}

	getPageComponentFromPath(path = window.location.pathname){
		const possiblePage = path.replace((new ReactSync).config.pages_prefix + '/', '');
		const possiblePageName = studly_case(possiblePage) + 'Page';
		return ReactSync.pages[possiblePageName];
	}

	renderDefault(){
		const P = this.getPageComponentFromPath();
		console.log(this);
		return (
			<PageShell Page={P} />
		)
	}

	get is_query(){
		return !(Object.keys(this.props).length);
	}

}

window.Page = Page;

Eloquent.applyTo(Page);
