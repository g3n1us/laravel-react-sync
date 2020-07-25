import React, { Component } from 'react';
import qs from 'qs';
import { axios, navigate } from '../fetchClient';

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



	/** */
	render(){

		let pagination;
		if(this.props.pagination) pagination = this.props.pagination;
		else if(this.props.items.pagination) pagination = this.props.items.pagination;
		else pagination = this.props;

		let links = [];
		let current_page = 1
		if(current_page == pagination.last_page){
			return null; // There is only one page, so return nothing
		}
		const query = { ...ReactSync.getInstance().request.query };
		while(current_page <= pagination.last_page){
			if(current_page == pagination.current_page){
				links.push(
					<li className="page-item active" key={str_rand(20)}><span className="page-link">{current_page}</span></li>
				);
			}
			else{
				links.push(
					<li className="page-item" key={str_rand(20)}>
						<a className="page-link" onClick={navigate} href={`?${qs.stringify({...query, page: current_page})}`}>{current_page}</a>
					</li>
				);
			}
			current_page++;
		}

		if(links.length > 10){
			let tmplinks = links.slice(0, 2);

			if(pagination.current_page < 4){
				tmplinks = tmplinks.concat(links.slice(2, (pagination.current_page + 2)));
			}
			else{
				tmplinks.push(<li className="page-item disabled" key={str_rand(20)}><span className="page-link">...</span></li>);
				tmplinks = tmplinks.concat(links.slice((pagination.current_page - 2), (pagination.current_page + 2)));
			}

			if((pagination.current_page + 2) >= (pagination.last_page - 2)){
				tmplinks = tmplinks.concat(links.slice(pagination.current_page + 2));
			}
			else{
				tmplinks.push(<li className="page-item disabled" key={str_rand(20)}><span className="page-link">...</span></li>);
				tmplinks = tmplinks.concat(links.slice((pagination.last_page - 2)));
			}

			links = tmplinks;

		}

	    let prev_page_url = `?${qs.stringify({...query, page: pagination.current_page - 1})}`;
	    let next_page_url = `?${qs.stringify({...query, page: pagination.current_page + 1})}`;

		return (
			<div className="d-flex justify-content-center">
				<ul className="pagination">
					{pagination.prev_page_url
						?
					<li className="page-item"><a className="page-link" onClick={navigate} href={prev_page_url} rel="previous">«</a></li>
						:
			        <li className="page-item disabled"><span className="page-link">«</span></li>
					}
			        {links}
					{pagination.next_page_url
						?
			        <li className="page-item"><a className="page-link" onClick={navigate} href={next_page_url} rel="next">»</a></li>
						:
					<li className="page-item disabled"><span className="page-link">»</span></li>
					}
			    </ul>
			</div>
		);
	}

}

export default Pagination;
