import React from 'react';
import Trait from './Trait';
import collect from 'collect.js';

/**
@kind mixin
@extends Trait
*/
class RenderableDefault extends Trait{

  constructor(targetClass){
    super(targetClass);
  }

/**

*/
  renderDefault(){

	  const mapped_properties = collect(this.props).map((v,i) => {
		  return <div key={`${this.key}_${i}`}>{i}: {this.props[i] && this.props[i].toString()}</div>
	  });

	  const public_props = collect(this.props).filter((v,k) => {
		  if(typeof v === 'function') return false;
		  return k.slice(-3) !== '_id' && k !== 'refresher';
	  }).map((v, k) => {
		  if(k in this.relations){
			  const rel = this.relations[k];
			  let count = null;
			  if('length' in rel) count = rel.length;
			  if('count' in rel) count = rel.count();
			  if(count) count = <small>{`(${count})`}</small>;
			  return <React.Fragment key={`${this.key}${k}`}><h4>{k} {count}</h4>{rel}</React.Fragment>;
		  }
		  else if(typeof v === 'object'){
			  return v && <p data-propname={k} key={`${this.key}${k}`}>{k}: {v.toString()}</p>;
		  }
		  else return <p data-propname={k} key={`${this.key}${k}`}>{k}: {v}</p>;
	  })

// 	  console.log(public_props);

     return (<div className="card m-3" data-modelname={this.constructor.name}>
                <div className="card-header">
                  <h3 className="mb-0 d-flex">
                    <a href={this.calculatedProperties.url}>{this.constructor.name}</a>
                  </h3>
                </div>
                <div className="card-body">
                    {public_props.toArray()}
                </div>
                <div className="card-footer text-right">

                </div>
            </div>);

  }

  renderListItem(){
	  return <div className="list-item">{this.constructor.name} : {this.props.name || this.props.value || this.props.id}</div>
  }

}

export default RenderableDefault
