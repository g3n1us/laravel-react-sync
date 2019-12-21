import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Alert from './Alert';

export default class LegacyModel extends Component{
	constructor(props){
		super(props);
		this.buttonData = {};
        this.handleInputChange = this.handleInputChange.bind(this);
	}

	static find(id){
		let prom = axios.get(`/api/${this.name.toLowerCase()}/${id}`);
		return <Async promise={prom} then={d => {
		    return React.createElement(this, {...d.data});
		}} />
	}

	static where(a,b,c){
		let query = [].slice.call(arguments);
		let prom = axios.get(`/api/${this.name.toLowerCase()}`, {params: {where: query}});
		return <Async promise={prom} then={d => {
			let els = d.data.map((e) => {
				return React.createElement(this, {...e});
			});
			return <>{els}</>
		}} />
	}

	static all(){
		let prom = axios.get(`/api/${this.name.toLowerCase()}`);
		return <Async promise={prom} then={d => {
			let els = d.data.data.map((e) => {
				return React.createElement(this, {...e});
			});
			return <>{els}</>
		}} />
	}


	getComponentFormData(){
		let $this = $(ReactDOM.findDOMNode(this));
		if(!$this.is('form'))
			$this = $this.find('form');
		let formdata;
		if(!$this.length){
			// This means that there isn't a form element in the component. This is OK!, we will find any inputs to determine the components data.
			// Note!! To call different methods (eg. delete, save, create) within a rendered component, you have to use separate forms.

			formdata = $(ReactDOM.findDOMNode(this)).find(':input').serialize();
			formdata = qs.parse(formdata);
		}
		else{
			formdata = qs.parse($this.serialize());
		}
		formdata = g3n1us_helpers.array_merge(this.props, formdata);
		formdata = g3n1us_helpers.array_merge(formdata, this.buttonData);
		if(!formdata.model_classname)
			formdata.model_classname = this._reactInternalInstance.getName();
		return formdata;
	}


	getApp(){
		return REACT_SYNC_DATA;
	}


	componentDidMount(){
		let $this = $(ReactDOM.findDOMNode(this));
		if(this.props.updateOnChange){
		    $this.on('change', ':input', (e) => {
			    this.handleInputChange(e);
		    });
		}

		if(!$this.is('form'))
			$this = $this.find('form');

		// if this isn't a form and no child nodes are forms, then ignore the rest and return
		if(!$this.length)
			return;

		// This adds a button's value to the form data
		$this.find('[type="submit"][name]').on('click', (e) => {
			let $btn = $(e.target);
			this.buttonData[$btn[0].name] = $btn[0].value;
		});
		$this.on('submit', (e) => {
			e.preventDefault();

			let formdata = this.getComponentFormData()
			this.updateRequest(formdata);
		});
	}


	updateRequest(formdata){
		let axios_method = window.g3n1us_helpers.array_get(formdata, '_method', 'post').toLowerCase();
		axios({
		  method: axios_method,
		  url: REACT_SYNC_DATA.api_endpoint,
		  data: formdata,
		})
		.then((response) => {
			REACT_SYNC_DATA.update();

			this.setState(response.data || {});

			let level = response.status < 400 ? 'success' : 'danger';

			ReactDOM.render(
				<Alert message="Saved" level={level} />,
				document.getElementById('notification_outer'),
			);

		});
	}


	handleInputChange(event) {

		event.preventDefault();

		const target = event.target;

		const value = target.type === 'checkbox' ? target.checked : target.value;

		const name = target.name;

		let formd = this.getComponentFormData();

		let thiskey = _.keys(qs.parse(name))[0];

		let filtered_formdata = g3n1us_helpers.array_only(formd, [thiskey, 'model_classname', '_method', 'id']);
		let final_filtered = {};
		for(let i in filtered_formdata){
			if(Array.isArray(filtered_formdata[i]))
				final_filtered[i] = _.filter(filtered_formdata[i]);
			else if(typeof filtered_formdata[i] !== "undefined"){
				final_filtered[i] = filtered_formdata[i];
			}
		}

		this.updateRequest(final_filtered);
	}

}


LegacyModel.addModel = function(M){
	LegacyModel.models = LegacyModel.models || {};
	if(!(M.name in LegacyModel.models))
		LegacyModel.models[M.name] = M;

}
