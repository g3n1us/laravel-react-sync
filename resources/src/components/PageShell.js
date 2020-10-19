import React, { Component } from 'react';
import axios from 'axios';
import collect from '../collect.js';

/** */
class PageShell extends Component{

	/** */
	static defaultProps = {
		Model: null,
	}

	/** */
	constructor(props){
		super(props);
		this.state = {
			children: null,
		}
	}

	/** */
	static cached = {}

	/** */
	componentDidMount(){
		const request_options = {
			headers: {'X-IsAjax': 'true', 'X-Requested-With': 'XMLHttpRequest'},
		}

		axios.get(window.location.href, request_options).then((new_page_data) => {
			this.setState({children: new_page_data.data});
		});
	}

	/** */
	render(){
		if(!this.state.children) return null;

		const { Page } = this.props;

		return <Page {...this.state.children} />
	}
}

export default PageShell;
