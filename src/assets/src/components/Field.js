import React, { Component } from 'react';
import { get, find } from 'lodash';

/** */
class Field extends Component{

	/** */
  constructor(props){
    super(props);

    this.onChangeHandler = this.onChangeHandler.bind(this.props.model);

    this.field_type = Field.field_type.bind(this.props.model);

    this.label = this.props.label || this.props.property;
  }

	/** */
  onChangeHandler(e){
    let thisprop = e.currentTarget.getAttribute('name');
    this.setState({[thisprop]: e.currentTarget.value});
  }

	/** */
  static field_type(key, model_instance = this){
    let n = get(model_instance.schema, key, {});
// 	  console.log(n.type == 'text'&& typeof model_instance.state[key] === 'object');

    const type_tests = [
      {field: null, test: (n) => typeof n.type === 'undefined'},
      {field: 'string', test: (n) => n.type == 'string'},
      {field: 'text', test: (n) => n.type == 'string' && n.max_length},
      {field: 'email', test: (n) => n.type == 'email' && n.max_length},
      {field: 'checkbox', test: (n) => n.type == 'boolean'},
      {field: 'integer', test: (n) => n.type == 'integer'},
      {field: 'datetime', test: (n) => n.type == 'datetime'},
      {field: 'json', test: n => n.type == 'text' && typeof model_instance.state[key] === 'object'},
      {field: 'text', test: n => n.type == 'text'},
      {field: 'file', test: n => n.type == ''},
      {field: 'relation', test: n => typeof n.type === 'object'},
    ];
    let type = find(type_tests, t => {
      return t.test(n)
    });
    return {type: type, schema: n};
  }


	/** */
  field(key){
    let {type, schema} = this.field_type(key);

    const rand = 'rand_' + Math.floor((Math.random()*10000000)+1);

	const val = this.props.model.state[key] || '';

    if(!type) return <label>{key}<input type="text" readOnly={true} value={val} /></label>;

	if(typeof type.field === 'json') console.log(key, val, type);

    const field_renders = {
      string: <input className="form-control" id={rand} type="text" name={key} value={val} onChange={this.onChangeHandler} />,

      checkbox: <input type="checkbox" id={rand} name={key} value={val} onChange={this.onChangeHandler} />,

      integer: <input className="form-control" id={rand} type="tel" pattern="[0-9]{1,100}" name={key} value={val} onChange={this.onChangeHandler} />,

      email: <input className="form-control" id={rand} type="email" name={key} value={val} onChange={this.onChangeHandler} />,

      datetime: <input className="form-control" id={rand} type="text" name={key} value={val} onChange={this.onChangeHandler} />,

      file: <div><label htmlFor={rand}>{val}</label><input id={rand} className="form-control-file" type="file" name={key} /></div>,

      text: <textarea className="form-control" id={rand} name={key} value={val} onChange={this.onChangeHandler} />,

      json: <textarea className="form-control" id={rand} name={key} value={JSON.stringify(val)} onChange={this.onChangeHandler} />

/*
      text: <CkOne
				    className="form-control"
                    editor={ '' }
                    data={ this.props.model.state[key] || '' }
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        this.props.model.setState({[key]: data});

                    } }
                />
*/

    }
    if(!field_renders[type.field]) return null;
    const classes = (this.props.className || '') + ' form-group';
    return <fieldset className={classes}><label htmlFor={rand}>{this.label}</label> {field_renders[type.field]}</fieldset>;
  }

	/** */
  render(){
    return this.field(this.props.property) || <div>{this.label}</div>;
  }


}

export default Field;
