import React, { Component } from 'react';
import axios from 'axios';
import collect from 'collect.js';

class Shell extends Component{

	static defaultProps = {
		url: null,
		Model: null,
	}

	constructor(props){
		super(props);
		this.state = {
			children: null,
		}
	}

	static cached = {}

	refresh(){
		const { Model } = this.props;
		const { url } = this.props;
		let fromcache;
		this.setState({children: null});
		if(!this.constructor.cached[url]){
			this.constructor.cached[url] = axios.get(url);
		}
		else{
			//
		}
		this.constructor.cached[url].then(response => {
			this.setState({children: response.data});
		}).catch((err) => {
			console.log(err, err.response);
			this.setState({children: null});
		});
	}

	componentDidMount(){
		this.refresh();
	}

	componentDidUpdate(prevProps, prevState, snapshot){
		if(prevProps.url != this.props.url){
			this.refresh();
		}
		else if(!this.constructor.cached[this.props.url]){
			this.refresh();
		}
	}

	render(){
		if(!this.state.children) return null;
		const { Model, url, then, ...remainder } = this.props;
		const { children } = this.state;

		// determine if we have received a paginator, collection, or single model
		let items;
		if(!Array.isArray(children) && ('id' in children)){

			items = [children];
		}
		else if(!('map' in children) && 'data' in children){
			items = children.data;
		}
		else if(!Array.isArray(children)){
			items = [children];
		}
		else{
			items = children;
		}

		if(then){
			return then(collect(items));
		}

		return (
			<>{items.map((props, i) => {
				const normal_props = Model.get_non_reserved_props(remainder);
				return <Model key={i} {...normal_props} {...props} />;
			})}
			</>
		);
	}
}

export default Shell;
