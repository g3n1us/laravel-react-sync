import React, { Component } from 'react';

/** */
class Field extends Component{

  constructor(props){
    super(props);

    this.onChangeHandler = this.onChangeHandler.bind(this.props.model);

    this.field_type = Field.field_type.bind(this.props.model);
  }

  onChangeHandler(e){
    let thisprop = e.currentTarget.getAttribute('name');
    this.setState({[thisprop]: e.currentTarget.value});
  }


  static field_type(key, model_instance = this){
    let n = _.get(model_instance.schema, key, {});
    console.log(n, key);
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
    let type = _.find(type_tests, t => {
      return t.test(n)
    });
    return {type: type, schema: n};
  }



  field(key){
    let {type, schema} = this.field_type(key);

	const val = this.props.model.state[key] || '';

    if(!type) return <label>{key}<input type="text" readOnly={true} value={val} /></label>;

	if(typeof type.field === 'json') console.log(key, val, type);

    const field_renders = {
      string: <input className="form-control" type="text" name={key} value={val} onChange={this.onChangeHandler} />,

      checkbox: <input type="checkbox" name={key} value={val} onChange={this.onChangeHandler} />,

      integer: <input className="form-control" type="tel" pattern="[0-9]{1,100}" name={key} value={val} onChange={this.onChangeHandler} />,

      email: <input className="form-control"  type="email" name={key} value={val} onChange={this.onChangeHandler} />,

      datetime: <input className="form-control"  type="text" name={key} value={val} onChange={this.onChangeHandler} />,

      file: <div><label>{val}</label><input className="form-control-file" type="file" name={key} /></div>,

      text: <textarea className="form-control" name={key} value={val} onChange={this.onChangeHandler} />,

      json: <textarea className="form-control" name={key} value={JSON.stringify(val)} onChange={this.onChangeHandler} />

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
    return <fieldset className="form-group"><label>{key}</label> {field_renders[type.field]}</fieldset>;
  }

  render(){
    return this.field(this.props.property) || <div>{this.props.property}</div>;
  }


}

export default Field;
