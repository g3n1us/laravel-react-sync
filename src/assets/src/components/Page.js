import React, { Component } from 'react';
import Event from '../Event';
import axios from '../fetchClient';
const { on, once } = Event;
import PageShell from './PageShell';

import ReactSync from '../ReactSync';

import Eloquent from './traits/Eloquent';

import { studly_case, kebab_case } from '../helpers';

import { navigate } from '../fetchClient';


/** */
class Page extends Component{
	/** */
	constructor(props){
		super(props);
		const { components, page_data, pages } = new ReactSync;
		components.push(this);

		ReactSync.pages[this.constructor.name] = this.constructor;

// 		this.ref = React.createRef();
	}

	/** */
	componentDidMount(){

    	once('navigating', e => {
        	this.getDomNode().setAttribute('data-react-sync-navigation', "navigating");
    	});

    	once('navigated', e => {
        	this.getDomNode().removeAttribute('data-react-sync-navigation');
    	});

		on('refresh-state', (e) => {
			this.setState(REACT_SYNC_DATA.page_data);
		});
	}

	getDomNode(){
    	return this.props.domNode || document.querySelector(`[data-react-render="${this.constructor.name}"]`);
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
			<a key={`NavLink${link}`} href={link} onClick={navigate} className="nav-link">{human_name}</a>
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

if(!Page.styleTagCreated){
    Page.styleTagCreated = true;
    const tag = document.createElement('style');
    tag.type = 'text/css';
    tag.innerHTML = `
    [data-react-sync-navigation]{
        position: relative;
    }
    [data-react-sync-navigation]::after{
        content: "loading...";
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.3);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 25px;
        cursor: wait;
    }
    `;
    document.head.appendChild(tag);

}


export default Page;

window.Page = Page;

Eloquent.applyTo(Page);
