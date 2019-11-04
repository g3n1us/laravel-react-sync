import React from 'react';
import ReactDOM from 'react-dom';
import Async from 'react-promise';
import Trait from './Trait';

/**
@kind mixin
@extends Trait
*/
class hasPluralForm extends Trait{

  constructor(targetClass){
    super(targetClass);
  }

	/** */
	  get plural(){
	    return pluralize(this.constructor.name.toLowerCase());
	  }


	/** */
	  static get plural_constructor(){
	    return pluralize(this.name.toLowerCase());
	  }

}

export default hasPluralForm;
