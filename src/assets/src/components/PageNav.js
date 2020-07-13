import React, { Component } from 'react';
import ReactSync from '../ReactSync';
import { collect } from 'collect.js';


class PageNav extends Component{
	render(){
		// nav
		const links = collect(ReactSync.pages).map(p => (new p).renderNavLink()).values();

		return links;
	}
}

export default PageNav;
