import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// import Notification, { NotificationRef } from 'laravel_react_sync';

import * as _models from 'models';

import LaravelReactSync, { Model, helpers as react_sync_helpers } from 'laravel_react_sync';

for(const M in _models) Model.addModel(_models[M]);

const { models } = Model;

class App extends Component {
	constructor(props){
		super(props);
		//! ?????
		const ReactSyncApp = react_sync_helpers.ReactSyncData();
		ReactSyncApp.app = this;
	}


    render() {
        const divs = Array.from(document.querySelectorAll('[data-react-render]'));
        const renderable_divs = divs.filter(x => {
            return !!x.dataset.reactRender;
        });
        const this_renderables = require('./');
        const page_renderables = require('pages');
        const renderables = { ...this_renderables, ...page_renderables };
        const portals = renderable_divs.map(renderable => {
            const Renderable = renderables[renderable.dataset.reactRender];
            if(typeof Renderable === "undefined"){
                throw new Error(`\n\nYou are trying to render a component called: '${renderable.dataset.reactRender}' that doesn't exist, or isn't exported from './Components'\n\nAvailable components are: ${Object.keys(renderables).join(', ')}\n\n`);
            }
            return ReactDOM.createPortal(
                <Renderable {...this.state} />,
                renderable
            );
/*
            return ReactDOM.createPortal(
                <Renderable app={this} app_state={{...this.state}} />,
                renderable
            );
*/
        });

        return portals;
    }
}

export default App;
