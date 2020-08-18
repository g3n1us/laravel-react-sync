import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// import Notification, { NotificationRef } from 'laravel_react_sync';

import * as _models from 'models';

import LaravelReactSync, { Model, PageNav, Reducer, helpers as react_sync_helpers } from 'laravel_react_sync';

const { app_current } = react_sync_helpers;

for(const M in _models) Model.addModel(_models[M]);

const { models } = Model;

class App extends Component {

	static instance;

	constructor(props){
		super(props);
		this.state = this.props.page_props;

		typeof window.app !== "function" && window.app = function(){
			return this;
		}.bind(this);
	}

	getPortalTargets(){
        const divs = Array.from(document.querySelectorAll('[data-react-render]'));
        return divs.filter(x => {
            return !!x.dataset.reactRender;
        });
	}

	components(){
		const { App, ...rest } = require('./');
		return { PageNav, ...rest };
	}

	pages(){
		return require('pages');
	}

	renderables(){
		return { ...this.components(), ...this.pages() };
	}

	get CurrentPage(){
		const { page_class } = this.state || this.props;

        return this.pages()[page_class];
	}

    render() {
        const renderables = this.renderables();

        const portals = this.getPortalTargets().map(renderable => {
            const Renderable = renderables[renderable.dataset.reactRender];
            if(typeof Renderable === "undefined"){
                throw new Error(`\n\nYou are trying to render a component called: '${renderable.dataset.reactRender}' that doesn't exist, or isn't exported from './Components'\n\nAvailable components are: ${Object.keys(renderables).join(', ')}\n\n`);
            }
            const { defaultProps = {} } = Renderable;
            const defaultPageProps = this.CurrentPage ? this.CurrentPage.defaultProps : {};
            return ReactDOM.createPortal(
                <Renderable attributes={{...renderable.dataset}} {...defaultProps} {...defaultPageProps} {...this.state} />,
                renderable
            );
        });

        return portals;
    }
}

export default App;
