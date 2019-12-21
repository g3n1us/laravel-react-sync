import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const REACT_SYNC_DATA = require('../App').default;

export default class Page extends Component{
	constructor(props){
		super(props);
		this.app = REACT_SYNC_DATA;
		this.state = this.app.page_data;
		// this.route_model_data = Model.extractInstancesFromUrl();
		REACT_SYNC_DATA.components.push(this);
	}



	componentDidMount(){
/*
		const from_url = Model.extractInstancesFromUrl();
		Model.resolveInstancesFromUrl(from_url).then(x => {
			console.log('x', x);
		});
*/

		$(this).on('refresh-state', (e) => {
			console.log('refresh-state !!!', e);
			this.setState(REACT_SYNC_DATA.page_data);
		});
	}

}
