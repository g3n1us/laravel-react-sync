import React, { Component } from 'react';
import qs from 'qs';

const REACT_SYNC_DATA = require('../ReactSync').default;
const str_rand = function(length = 5){
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for( var i=0; i < length; i++ )
	text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}


export default class Pagination extends Component{

	render(){
		let links = [];
		let current_page = 1
		if(current_page == this.props.last_page){
			return null; // There is only one page, so return nothing
		}

		while(current_page <= this.props.last_page){
			if(current_page == this.props.current_page){
				links.push(
					<li className="page-item active" key={str_rand(20)}><span className="page-link">{current_page}</span></li>
				);
			}
			else{
				let req = REACT_SYNC_DATA.request;
				req.page = current_page;
				links.push(
					<li className="page-item" key={str_rand(20)}>
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
				tmplinks.push(<li className="page-item disabled" key={str_rand(20)}><span className="page-link">...</span></li>);
				tmplinks = tmplinks.concat(links.slice((this.props.current_page - 2), (this.props.current_page + 2)));
			}

			if((this.props.current_page + 2) >= (this.props.last_page - 2)){
				tmplinks = tmplinks.concat(links.slice(this.props.current_page + 2));
			}
			else{
				tmplinks.push(<li className="page-item disabled" key={str_rand(20)}><span className="page-link">...</span></li>);
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
