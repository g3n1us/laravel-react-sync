import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import qs from 'qs';


// This componenet maps specifically to a Laravel model. On componentWillUpdate, the new state is sent to the application via an AJAX request to be updated in the database. //!!! Well, just kidding for now.

export class ModelComponent extends Component{
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



export class MasterComponent extends Component{
	constructor(props){
		super(props);

		this.state = ReactSyncAppData.page_data;
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



export class Alert extends Component{
	
	render() {
		
		return <div className={`alert fade show alert-${this.props.level || 'success'}`}>{this.props.message} <a className="close text-muted" data-dismiss="alert"></a></div>;

	}	
	
}


export class Pagination extends Component{
	constructor(props){
		super(props);
	}
	
	render(){
		let links = [];
		let current_page = 1
		if(current_page == this.props.last_page) 
			return null; // There is only one page, so return nothing
		
		
		while(current_page <= this.props.last_page){
			if(current_page == this.props.current_page){
				links.push(
					<li className="page-item active" key={g3n1us_helpers.randid()}><span className="page-link">{current_page}</span></li>
				);
			}
			else{
				links.push(
					<li className="page-item" key={g3n1us_helpers.randid()}>
						<a className="page-link" href={`?page=${current_page}`}>{current_page}</a>
					</li>
				);					
			}
			current_page++;
		}
		if(links.length > 10){
			let tmplinks = links.slice(0, 2);
			
			if(this.props.current_page < 3){
				tmplinks = tmplinks.concat(links.slice(2, (this.props.current_page + 2)));
			}
			else{
				tmplinks.push(<li className="page-item disabled" key={g3n1us_helpers.randid()}><span className="page-link">...</span></li>);
				tmplinks = tmplinks.concat(links.slice((this.props.current_page - 2), (this.props.current_page + 2)));
			}
			
			if((this.props.current_page + 2) >= (this.props.last_page - 2)){
				tmplinks = tmplinks.concat(links.slice(this.props.current_page + 2));
			}
			else{
				tmplinks.push(<li className="page-item disabled" key={g3n1us_helpers.randid()}><span className="page-link">...</span></li>);
				tmplinks = tmplinks.concat(links.slice((this.props.last_page - 2)));				
			}
				
			links = tmplinks;					
		}
		
		return (
			<div className="d-flex justify-content-center">
				<ul className="pagination">
					{this.props.prev_page_url 
						? 
					<li className="page-item"><a className="page-link" href={this.props.prev_page_url} rel="previous">«</a></li>
						:
			        <li className="page-item disabled"><span className="page-link">«</span></li>
					}     
			        {links}
					{this.props.next_page_url 
						? 
			        <li className="page-item"><a className="page-link" href={this.props.next_page_url} rel="next">»</a></li>
						:
					<li className="page-item disabled"><span className="page-link">»</span></li>
					}     
			    </ul>
			</div>			
		);
	}
	
}
