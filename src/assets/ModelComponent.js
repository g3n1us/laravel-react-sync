import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import qs from 'qs';

import MasterComponent from './MasterComponent';
import Alert from './Alert';

// This componenet maps specifically to a Laravel model. On componentWillUpdate, the new state is sent to the application via an AJAX request to be updated in the database. //!!! Well, just kidding for now.

export default class ModelComponent extends Component{
	constructor(props){
		super(props);
	    
	    if(!window.ModelComponentHandlersSet){
		    // prevent handler from getting set multiple times
		    window.ModelComponentHandlersSet = true;
		    
		    $(document).on('change', ':input', (e) => {
			    console.log(e);
			    this.handleInputChange(e);
		    });
	    }
	}
	
	componentDidMount(){
		let $this = $(ReactDOM.findDOMNode(this));
		if(!$this.is('form'))
			$this = $this.find('form');
		this.buttonData = {};
		// This adds a button's value to the form data
		$this.find('[type="submit"][name]').on('click', (e) => {
			let $btn = $(e.target);
			this.buttonData[$btn[0].name] = $btn[0].value;
		});
		$this.on('submit', (e) => {
			e.preventDefault();

			let formdata = qs.parse($this.serialize());

			formdata = g3n1us_helpers.array_merge(this.props, formdata);
			formdata = g3n1us_helpers.array_merge(formdata, this.buttonData);
			if(!formdata.model_classname)
				formdata.model_classname = this._reactInternalInstance.getName();
			let axios_method = window.g3n1us_helpers.array_get(formdata, '_method', 'post').toLowerCase();
			axios({
			  method: axios_method,
			  url: '/update-state',
			  data: formdata,
			})
			.then((response) => {
				if(response.data){
					this.setState(response.data);
				}
				else{
					this.setState({});
				}
					
				$.event.trigger({
					type: "state-has-changed",
					data: response.data,
				});
				

				let level = response.status < 400 ? 'success' : 'danger';

				ReactDOM.render(
					<Alert message="Saved" level={level} />,
					document.getElementById('notification_outer'),
				);
				
			});
		});
	}
	
		
	handleInputChange(event) {
		const target = event.target;
		
		const value = target.type === 'checkbox' ? target.checked : target.value;
		if(target.type) return;
		
		const name = target.name;
		// Maybe use this for validation?
		this.setState({
			[name]: value
		});
	}
	
	
}

