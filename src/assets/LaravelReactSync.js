import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import qs from 'qs';
import Async from 'react-promise';
import Model from './src/Model';

const REACT_SYNC_DATA = window[window.ReactSyncGlobal];
// This componenet maps specifically to a Laravel model.

Async.defaultPending = (
  <span>loading...</span>
)

export class ModelComponent extends Component{
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
			if(_.isArray(filtered_formdata[i]))
				final_filtered[i] = _.filter(filtered_formdata[i]);
			else if(typeof filtered_formdata[i] !== "undefined"){
				final_filtered[i] = filtered_formdata[i];
			}
		}

		this.updateRequest(final_filtered);
	}


}

ModelComponent.addModel = function(M){
	ModelComponent.models = ModelComponent.models || {};
	if(!(M.name in ModelComponent.models))
		ModelComponent.models[M.name] = M;

}


export class MasterComponent extends Component{
	constructor(props){
		super(props);
		this.app = { ...REACT_SYNC_DATA };
		this.state = this.app.page_data;
		this.route_model_data = Model.extractInstancesFromUrl();
		REACT_SYNC_DATA.components.push(this);
	}



	componentDidMount(){
/*
		const from_url = Model.extractInstancesFromUrl();
		Model.resolveInstancesFromUrl(from_url).then(x => {
			console.log('x', x);
		});
*/

		$(this).on('refresh-state', (e) => {
			console.log('refresh-state !!!', e);
			this.setState(REACT_SYNC_DATA.page_data);
		});
	}

}


export class Alert extends Component{
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


export class Pagination extends Component{
	constructor(props){
		super(props);
	}

	render(){
		let links = [];
		let current_page = 1
		if(current_page == this.props.last_page){
			return null; // There is only one page, so return nothing
		}

		while(current_page <= this.props.last_page){
			if(current_page == this.props.current_page){
				links.push(
					<li className="page-item active" key={g3n1us_helpers.str_rand(20)}><span className="page-link">{current_page}</span></li>
				);
			}
			else{
				let req = REACT_SYNC_DATA.request;
				req.page = current_page;
				links.push(
					<li className="page-item" key={g3n1us_helpers.str_rand(20)}>
						<a className="page-link" href={`?${qs.stringify(req)}`}>{current_page}</a>
					</li>
				);
			}
			current_page++;
		}

		if(links.length > 10){
			let tmplinks = links.slice(0, 2);

			if(this.props.current_page < 4){
				tmplinks = tmplinks.concat(links.slice(2, (this.props.current_page + 2)));
			}
			else{
				tmplinks.push(<li className="page-item disabled" key={g3n1us_helpers.str_rand(20)}><span className="page-link">...</span></li>);
				tmplinks = tmplinks.concat(links.slice((this.props.current_page - 2), (this.props.current_page + 2)));
			}

			if((this.props.current_page + 2) >= (this.props.last_page - 2)){
				tmplinks = tmplinks.concat(links.slice(this.props.current_page + 2));
			}
			else{
				tmplinks.push(<li className="page-item disabled" key={g3n1us_helpers.str_rand(20)}><span className="page-link">...</span></li>);
				tmplinks = tmplinks.concat(links.slice((this.props.last_page - 2)));
			}

			links = tmplinks;

		}

		let req = REACT_SYNC_DATA.request;
		req.page = this.props.current_page - 1;
    let prev_page_url = `?${qs.stringify(req)}`;
		req.page = this.props.current_page + 1;
    let next_page_url = `?${qs.stringify(req)}`;
		return (
			<div className="d-flex justify-content-center">
				<ul className="pagination">
					{this.props.prev_page_url
						?
					<li className="page-item"><a className="page-link" href={prev_page_url} rel="previous">«</a></li>
						:
			        <li className="page-item disabled"><span className="page-link">«</span></li>
					}
			        {links}
					{this.props.next_page_url
						?
			        <li className="page-item"><a className="page-link" href={next_page_url} rel="next">»</a></li>
						:
					<li className="page-item disabled"><span className="page-link">»</span></li>
					}
			    </ul>
			</div>
		);
	}

}
