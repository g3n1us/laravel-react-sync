import React, { Component } from 'react';
import Trait from './Trait';
import collect from '../../collect.js';
import { def } from '../../helpers';

/**
@kind mixin
@extends Trait
*/
class hasAttributes extends Trait{

	attributes = {};

    setAttributes(){
		const keys = Object.keys(this.props);

		this.attributes = keys.reduce((acc, v) => {
			if(typeof this[v] !== "undefined"){
				acc[v] = this[v];
			}
			else {
				acc[v] = this.props[v];
			}
			return acc;
		}, {});


// 		console.log(this.relations);
// 		console.log(this.schema);
// 		console.log(this.attributes);
    }

}

export default hasAttributes;
