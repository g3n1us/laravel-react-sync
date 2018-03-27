import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as helpers from 'g3n1us_helpers';

helpers.dd = function(v){
	console.log(JSON.parse(JSON.stringify(v)));
	debugger;
}
 

export default class MasterComponent extends Component{
	constructor(props){
		super(props);
		this.helpers = window.g3n1us_helpers = helpers;

		this.state = DocumentPortal.page_data;
		
	}

	
	
	componentDidMount(){
		if(!this.state_has_been_changed_has_been_set){
			console.log("SETTING('state_has_been_changed_has_been_set)", this);
			
			$(document).on('refresh-state state-has-changed', (e) => {
				console.log('refresh-state or state-has-changed !!!', e);

				axios.get('').then(new_page_data => {
					console.log(new_page_data.data);
					this.setState(new_page_data.data);
				});				
			});		
			
			this.state_has_been_changed_has_been_set = true;
		}
	}
	
	
	
	// This is possibly a leftover from an experiment
	fm(dotkey, val, model, id){
		let key_arr = dotkey.split('.');
		let current_val = key_arr.reduceRight(function (pastResult, currentKey) {
		    var obj = {};
		    obj[currentKey] = pastResult;
		    return obj;
		}, val);
		let resp = {
			data: current_val,
			model: model,
			id: id,			
		}
		return JSON.stringify(resp);
	}
	
}


