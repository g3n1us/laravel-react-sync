import React, { Component } from 'react';
import { Field, Pagination } from './';
import { navigate, axios } from '../fetchClient';

import collect from '../collect.js';
import qs from 'qs';


export default class Table extends Component{

	static get defaultProps(){
		return {
			columns: ['name'],
			model: null,
			serverSort: true,
			data: null,
		};
	}


	constructor(props){
		super(props);

		this.state = {
			order_direction: this.props.order_direction || 'asc',
			order_by: this.props.order_by || 'name',
		}

		this.model = null;
	}


/*
    componentDidMount(){
        if(this.state.rows) return;
    }
*/

	otherSortDir = () => {
        let newsort;
        if(this.state.order_direction === 'desc') newsort = 'asc';
        else newsort = 'desc';
        return newsort;
	}


	setSort = (e) => {
		const sort_column = e.currentTarget.dataset.column;
		let order_direction = this.state.order_direction;
		let order_by = this.state.order_by;
		if(this.state.order_by === sort_column){
    		order_direction = this.otherSortDir();
		}
        else{
            order_by = sort_column;
        }

        this.setSortServer({ order_direction, order_by });



		if(this.model.relations[sort_column]){
            // WIP handled on server currently
		}
	}

	setSortServer = (newProps) => {
		console.log(newProps);
    	this.setState({ ...newProps }, () => {
	    	let query = qs.parse(window.location.search.slice(1));
	    	const api_sort = {
	        	order_by: newProps.order_by,
	        	order_direction: newProps.order_direction
	    	}
	    	const query_string = qs.stringify({...query, ...api_sort});

	    	navigate(window.location.pathname + '?' + query_string);
    	});
	}


	clean_heading = (str) => {
		return str.replace(/_/g, ' ').toUpperCase();
	}


	render_table_row = (_props, ModelInstance) => {
		this.model = ModelInstance;

		const { columns } = this.props;
		const { props, key, url } = ModelInstance;
		const { editable_props } = ModelInstance.constructor;

        const extendedinfo = columns.map((v, i) => {
	        let content = null;


	        if(editable_props && editable_props.includes(v)){
    	        content = <a onClick={navigate} href={ModelInstance.url}>{props[v]}</a>;
	        }
	        else if(v === 'name'){
    	        content = <a onClick={navigate} href={ModelInstance.url}>{props[v]}</a>;
	        }
	        else if(v in ModelInstance.relations){
    	        const { props, type } = ModelInstance.relations[v];
    	        const T = type;
    	        content = ModelInstance.relations[v].show({render: p => p.name});
	        }
	        else if(v in ModelInstance) {


		        if(typeof ModelInstance[v] === "function"){
    		        content = ModelInstance[v].bind(ModelInstance)();
		        }
		        else if(_.isNull(ModelInstance[v])){
    		        content = '';
		        }
		        else if(typeof ModelInstance[v].show === "function"){
    		        content = ModelInstance[v].show();
		        }
		        else content = ModelInstance[v] + '';

	        }
	        else {
		        content = props[v];

		        if(typeof content === "function"){
    		        content = content.bind(ModelInstance)();
		        }
		        else{
//     		        content = content.show();
		        }
	        }

            if(content && typeof content === "object"){
    	        if(('renderTableCell' in content) && typeof content.renderTableCell === "function"){
        	        content = content.renderTableCell();
    	        }
                else if(('render' in content) && typeof content.render === "function"){
                    content = content.render();
                }
            }
	        return <td className={`lg-clickable`} key={i + key}>{content}</td>
        });
        return <tr key={key + 'tr'}>{extendedinfo}</tr>;

	}

    getModel(){
    	const { associatedModel} = app().CurrentPage;

        return this.props.model || associatedModel;
    }

    getRows(){
        const { associatedModel} = app().CurrentPage;
/*
//         const { order_by, order_direction } = this.state;
{
			columns: ['name'],
			model: associatedModel,
			serverSort: true,
			data: associatedModel && app().props.page_props[associatedModel.plural_handle],
		};
*/

		const rows = this.props.data || associatedModel && app().state[associatedModel.plural_handle];

		if(collect(rows).isEmpty()){
			return null;
		}

        return rows;


/*
        if(rows === null){
            return this.props.data;
        }
        else{
            const sortFn = order_direction === 'asc' ? 'order_by' : 'sortByDesc';
            return rows[sortFn](v => {
                const sortvalue = v.props[order_by] || v[order_by];
                if(typeof sortvalue === "object"){
                    return sortvalue.name;
                }
                return sortvalue;
            })
        }
*/
    }


    currentSortProp = (v) => {
        const { order_by, order_direction } = this.state;

        if(order_by === v){
            return order_direction;
        }
        return null;
    }


	render(){

        const headings = this.props.columns.map((v, i) => <th title={this.clean_heading(v)} scope="col" data-currentsort={this.currentSortProp(v)} onClick={this.setSort} data-column={v} key={i}><span>{this.clean_heading(v)}</span></th>);
        const footings = this.props.columns.map((v, i) => <th title={this.clean_heading(v)} scope="col" data-currentsort={this.currentSortProp(v)} onClick={this.setSort} data-column={v} key={`${i}tfoot`}><span>{this.clean_heading(v)}</span></th>);
        const { order_by, order_direction } = this.state;

        let sorted_rows = this.getRows();

        let pagination = null;

        if(sorted_rows === null){
	        sorted_rows = (
		        <tr>
			        <td colSpan={headings.length}> No Data </td>
		        </tr>
	        );
        }
		else{
	        pagination = <Pagination {...sorted_rows} />;


	        sorted_rows = sorted_rows.map(v => this.render_table_row(v.props, v)).all();

		}

        return (
            <>
            {pagination}

            <div className="table-responsive">
                <table summary={`This table contains data related to ${this.getModel().plural}`} data-sort_by={order_by} data-sort_order={order_direction} className="react_sync_table table table-bordered table-striped table-hover editable-table">
	                <thead>
		                <tr>{headings}</tr>
	                </thead>
	                <tfoot>
		                <tr>{footings}</tr>
	                </tfoot>
	                <tbody>
		                {sorted_rows}
	                </tbody>
                </table>
            </div>

            {pagination}
            </>
        );

	}

}
