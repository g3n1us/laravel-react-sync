import React from 'react';
import Field from '../Field';
import Trait from './Trait';

/**
@kind mixin
@extends Trait
*/
class RenderableAsBasicForm extends Trait{

/**

*/
  renderBasicForm(){

    let breadcrumbs = this.props.id ? <nav aria-label="breadcrumb">
					    <ol className="breadcrumb ml-auto">
						    {this.breadcrumb.map((s, i) => <li className="breadcrumb-item" key={i}><a href={s}>{_.filter(s.split('/').slice(-1)).length ? s.split('/').slice(-1).toString() : 'Home'}</a></li>)}
					    </ol>
				      </nav> : null;
    return (<form className="card m-3" onSubmit={(e) => {
                  e.preventDefault();
                  if(this.props.id)
                    this.save();
                  else{
                    this.create();
                  }

                }}>
                <div className="card-header">
                  <h3 className="mb-0 d-flex">
                    <a href={this.calculatedProperties.url}>{this.constructor.name}</a>
                  </h3>
                </div>
                <div className="card-body">
                    <div>
	                    {breadcrumbs}
                    </div>
                    {Object.keys(this.mutableState).map(i => <Field model={this} property={i} key={`${this.key}_${i}`} />)}
                    {(this.additional_edit_fields ? this.additional_edit_fields : []).map((fff, i) => <div className="form-group" key={`additional_edit_fields_${i}`}>{fff}</div>)}
                </div>
                <div className="card-footer text-right">
                  <button type="submit" className="btn btn-lg btn-primary">Save</button>
                </div>
            </form>);

  }

}

export default RenderableAsBasicForm
