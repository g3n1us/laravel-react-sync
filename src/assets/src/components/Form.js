import React, { Component } from 'react';
import { Csrf } from '../extras';
import axios from 'axios';

export default class Form extends Component{
	constructor(props){
		super(props);

	}

	onSubmit = e =>{
		e.preventDefault();
		const form = e.currentTarget;
		let formdata = {};
		const data = Array.from(new FormData(form)).forEach(v => formdata[v[0]] = v[1]);
		const { method, action } = this.form_props;
		axios[method](action, formdata).then(response => {
			console.log('response', response);
		});

	}

	get form_props(){
		return {
			...this.props,
			action: this.props.action || window.location,
			method: this.props.method || 'post',
		}
	};

	render(){
		return (
			<form {...this.form_props} onSubmit={this.onSubmit}>
				{this.props.children}
				<Csrf />
			</form>
		);
	}
}


