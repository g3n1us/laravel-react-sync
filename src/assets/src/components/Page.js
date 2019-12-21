import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Event from '../Event';
import axios from 'axios';
const { on } = Event;
const REACT_SYNC_DATA = require('../App').default;

import { App } from '../App';

export default class Page extends Component{
	constructor(props){
		super(props);
		this.app = REACT_SYNC_DATA;
		this.state = this.app.page_data;
		// this.route_model_data = Model.extractInstancesFromUrl();
		REACT_SYNC_DATA.components.push(this);
		console.log(new App);
	}



	componentDidMount(){
/*
		WIP!! todo make opt-in
		const from_url = Model.extractInstancesFromUrl();
		Model.resolveInstancesFromUrl(from_url).then(x => {
			console.log('x', x);
		});
*/
		if(typeof $ !== 'undefined'){
			$(this).on('refresh-state', (e) => {
				console.log('refresh-state !!!', e);
				this.setState(REACT_SYNC_DATA.page_data);
			});
		}
		on('refresh-state', (e) => {
			console.log('refresh-state !!!', e);
			this.setState(REACT_SYNC_DATA.page_data);
		});
	}

	refresh(callback = () => {}){
		return axios.get('').then(function(new_page_data){
			this.setState(new_page_data.data, callback);
		});
	}

}
