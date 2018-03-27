import React, { Component } from 'react';
import ReactDOM from 'react-dom';


export default class Alert extends Component{
	
	render() {
		
		return <div className={`alert fade show alert-${this.props.level || 'success'}`}>{this.props.message} <a className="close text-muted" data-dismiss="alert"></a></div>;

	}	
	
}
