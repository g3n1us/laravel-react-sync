import React from 'react';
import Trait from './Trait';
window.faker = require('faker');
/**
@kind mixin
@extends Trait
*/
class Mockable extends Trait{

	/** */
  static mock(){
    let fake_state = this.mergedMockProps();
    console.log(this.refreshers, fake_state, this.refresher);
    this.create(fake_state);
  }


/**
* This will typically be overridden inside a Model instance. This provides a default.
*/
  static get mockProps(){
    return {};
  }

/**

*/
  static mergedMockProps(){
    let props = _.keys(this.schema).map(key => this.getDefaultMockType(key));
    props = _.fromPairs(_.filter(props));
    props = _.assign(props, this.mockProps);
    return props;
  }


  static array_random(arr){
    var random = Math.floor(Math.random() * arr.length);
    return arr[random];
  }

/**

*/
  static getDefaultMockType(key){

    let n = _.get(this.schema, key, {read_only: true});
    if(n.read_only) return null;
    const type_tests = [
      {faker: faker.lorem[this.array_random(_.keys(faker.lorem))], test: (n) => n.type == 'string' && n.max_length},
      {faker: faker.internet.email, test: (n) => n.type == 'email' && n.max_length},
      {faker: faker.random.boolean, test: (n) => n.type == 'boolean'},
      {faker: faker.random.number, test: (n) => n.type == 'integer'},
      {faker: faker.date[this.array_random(_.keys(faker.date))], test: (n) => n.type == 'datetime'},
      {faker: faker.lorem[this.array_random(_.keys(faker.lorem))], test: n => n.type == 'string'},
    ];
    let type = _.find(type_tests, t => {
      return t.test(n)
    });
    return type ? [key, type.faker()] : null;
  }



}

export default Mockable;