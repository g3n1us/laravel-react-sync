import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Alert extends Component{
	constructor(props){
		super(props);
		this.state = {show: true};
	}

	componentDidMount(){
		setTimeout(() => {
			$(ReactDOM.findDOMNode(this)).alert('close').on('closed.bs.alert', () => {
			  // this.setState({show: false});
			});
		}, 3000);

	}

	render() {
		return this.state.show ? <div style={{position: 'fixed', margin: 'auto', left: 0, right: 0, zIndex: '99999'}} className={`alert fade show alert-${this.props.level || 'success'}`}>{this.props.message} <a className="close text-muted" data-dismiss="alert">&times;</a></div> : null;
	}
}
