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
		this.state = {children: null}
	}

	componentDidMount(){
		const { Model, url } = this.props;
		axios.get(url)
			.then(response => this.setState({children: response.data}));
	}

	render(){
// 		if(!this.state.children) return <div>loading...</div>;
		if(!this.state.children) return null;
		const { Model, url, ...remainder } = this.props;
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
