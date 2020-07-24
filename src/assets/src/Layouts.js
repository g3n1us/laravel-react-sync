import React, { Component } from 'react';


export function BasicLayout(props){
	return (
		<div className="container">
			<div className="row">
				<div className="col-md-12">
					{props.children}
				</div>
			</div>
		</div>
	);
}


export function FluidLayout(props){
	return (
		<div className="container-fluid">
			<div className="row">
				<div className="col-md-12">
					{props.children}
				</div>
			</div>
		</div>
	);
}
