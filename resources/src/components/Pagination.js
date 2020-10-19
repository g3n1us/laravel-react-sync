import React, { Component } from 'react';
import qs from 'qs';
import { axios, navigate } from '../fetchClient';

import { isPaginated } from '../helpers';

// const REACT_SYNC_DATA = require('../ReactSync').default;

import ReactSync from '../ReactSync';

const str_rand = function(length = 5){
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for( var i=0; i < length; i++ )
	text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}


class Pagination extends Component{

    navigate = (e) => {
        e.preventDefault();
        if(this.props.onClick){
            return this.props.onClick(e);
        }

        return navigate(e);
    }

	/** */
	render(){

		let pagination;
		if(this.props.pagination) pagination = this.props.pagination;
		else if(this.props.items && this.props.items.pagination) pagination = this.props.items.pagination;
		else pagination = this.props;

        if(!isPaginated(pagination)){
            console.log("Non-paginated object passed to Pagination: ", pagination);
            return null;
        }

        const { current_page, first_page_url, from, last_page, last_page_url, next_page_url, path, per_page, prev_page_url, to, total } = pagination;

		let links = [];
		let _current_page = 1
		if(_current_page === last_page){
			return null; // There is only one page, so return nothing
		}
		const query = { ...ReactSync.getInstance().request.query };
		while(_current_page <= last_page){
			if(_current_page == current_page){
				links.push(
					<li className="page-item active" key={str_rand(20)}><span className="page-link">{_current_page}</span></li>
				);
			}
			else{
				links.push(
					<li className="page-item" key={str_rand(20)}>
						<a className="page-link" onClick={this.navigate} href={`?${qs.stringify({...query, page: _current_page})}`}>{_current_page}</a>
					</li>
				);
			}
			_current_page++;
		}

		if(links.length > 10){
			let tmplinks = links.slice(0, 2);

			if(current_page < 4){
				tmplinks = tmplinks.concat(links.slice(2, (current_page + 2)));
			}
			else{
				tmplinks.push(<li className="page-item disabled" key={str_rand(20)}><span className="page-link">...</span></li>);
				tmplinks = tmplinks.concat(links.slice((current_page - 2), (current_page + 2)));
			}

			if((current_page + 2) >= (last_page - 2)){
				tmplinks = tmplinks.concat(links.slice(current_page + 2));
			}
			else{
				tmplinks.push(<li className="page-item disabled" key={str_rand(20)}><span className="page-link">...</span></li>);
				tmplinks = tmplinks.concat(links.slice((last_page - 2)));
			}

			links = tmplinks;

		}

	    let _prev_page_url = `?${qs.stringify({...query, page: current_page - 1})}`;
	    let _next_page_url = `?${qs.stringify({...query, page: current_page + 1})}`;

		return (
			<div className="d-flex justify-content-center">
				<ul className="pagination">
					{prev_page_url
						?
					<li className="page-item"><a className="page-link" onClick={this.navigate} href={_prev_page_url} rel="previous">«</a></li>
						:
			        <li className="page-item disabled" disabled><span className="page-link">«</span></li>
					}
			        {links}
					{next_page_url
						?
			        <li className="page-item"><a className="page-link" onClick={this.navigate} href={_next_page_url} rel="next">»</a></li>
						:
					<li className="page-item disabled" disabled><span className="page-link">»</span></li>
					}
			    </ul>
			</div>
		);
	}

}

export default Pagination;
