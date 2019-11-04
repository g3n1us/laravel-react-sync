import React from 'react';
import Field from '../Field';
import Trait from './Trait';

/**
@kind mixin
@extends Trait
*/
class RenderableAsDiagram extends Trait{

  constructor(targetClass){
    super(targetClass);
  }

/**

*/
  renderModelDiagram(){
      let rels = this.getRelations().map(r => {
      /**
        @todo use a real key!
      */
      let rand = Math.floor((Math.random()*10000)+1); ///!!! ⬅ TODO use a real key
      return <li key={rand}>{this[r]()}</li>
    });

    let calculated_props = this.getCalculatedProperties().map(r => {
      /**
        @todo use a real key!
      */
      let rand = Math.floor((Math.random()*10000)+1); ///!!! ⬅ TODO use a real key
      let owningObj = r in this ? this : this.calculatedProperties;
      if(is_url(owningObj[r])) return <li key={rand}>{r}: <a href={owningObj[r]} target="_blank">{owningObj[r]}</a></li>
      return <li key={rand}>{r}: {owningObj[r]}</li>
    });

    let props_rendered = [];
    for(let i in this.props){

      let key = this.props.id + this.constructor.name + i;

      let propValue = typeof this.state[i] === 'object' ? JSON.stringify(this.state[i]) : this.state[i];
      if([...this.getRelations(), 'id', 'created_at', 'updated_at'].indexOf(i) === -1){
          props_rendered.push(
                              <li key={key}>
                                <Field model={this} property={i} />
                              </li>
                              )
      }
      else{
          props_rendered.push(<li key={key}>{i}
                <code title="default value"> {propValue || 'null'} </code></li>);
      }
    }

    return <div className="border_bottom model">
              <h3><a href={this.calculatedProperties.url}>{this.constructor.name}</a></h3>
              <form className="ml card card-body" onSubmit={(e) => {
                    e.preventDefault();
                    this.save();
                  }}>
                  <h5>properties</h5>
                  <ul>
                    {props_rendered}
                  </ul>

                  <h5>calculated properties</h5>
                  <ul>
                    {calculated_props}
                  </ul>

                  <h5>relations</h5>
                  <ul>
                    {rels}
                  </ul>
                  <p>
                  <button type="submit" className="btn btn-primary">Save</button>
                  </p>
              </form>
            </div>;

  }

}

export default RenderableAsDiagram;
