import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// import Notification, { NotificationRef } from 'laravel_react_sync';

import * as react_sync_helpers from './helpers.js';

import Reducer from './Reducer.js';

import { PageNav } from './components';


const { app_current } = react_sync_helpers;


class App extends Component {

	static instance;

	static app = () => {};

	constructor(props){
		super(props);

		this.state = Reducer();

		App.app = function(){
			return this;
		}.bind(this);

		window.app = App.app;
	}

	getPortalTargets(){
        const divs = Array.from(document.querySelectorAll('[data-react-render]'));
        return divs.filter(x => {
            return !!x.dataset.reactRender;
        });
	}

	components(){
		const rest = require('js/components');
		return { PageNav, ...rest };
	}

	pages(){
		return require('pages');
	}

	models(){
		return require('models');
	}

	renderables(){
		return { ...this.components(), ...this.pages() };
	}

	get CurrentPage(){
		const { page_class } = this.state || this.props;

        return this.pages()[page_class] || {};
	}

    render() {
        const renderables = this.renderables();

        const portals = this.getPortalTargets().map(renderable => {
            const Renderable = renderables[renderable.dataset.reactRender];
            if(typeof Renderable === "undefined"){
                throw new Error(`\n\nYou are trying to render a component called: '${renderable.dataset.reactRender}' that doesn't exist, or isn't exported from './Components'\n\nAvailable components are: ${Object.keys(renderables).join(', ')}\n\n`);
            }
            const { defaultProps = {} } = Renderable;
            return ReactDOM.createPortal(
                <Renderable attributes={{...renderable.dataset}} {...defaultProps} {...this.CurrentPage.defaultProps} {...this.state} />,
                renderable
            );
        });

        return portals;
    }
}

export function app(){
	return App.app();
}

export default App;
