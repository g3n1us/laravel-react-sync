import Trait from './Trait';

/**
@kind mixin
@extends Trait
*/
class HasReflection extends Trait{

  constructor(targetClass){
    super(targetClass);
  }

/**
 * Returns the class properties that represent a relation to another model
 */
  getRelations(){
    let p = Object.getPrototypeOf(this);
    return Object.getOwnPropertyNames(p).filter((q) => {
      return q.toString() != 'constructor' && !(Object.getOwnPropertyDescriptor(p, q)).get;
    });
  }

/**
 * Returns properties that exist via getters, or in the explicit object property: `this.calculatedProperties`
 *
 */
  getCalculatedProperties(){
    let p = Object.getPrototypeOf(this);
    let all_properties = Object.getOwnPropertyNames(p).concat(Object.getOwnPropertyNames(this.calculatedProperties));

    return all_properties.filter((q) => {
      if(q in p) return Object.getOwnPropertyDescriptor(p, q).get;
      else return q in this.calculatedProperties;
    });
  }

/**
 * Returns explicitly ignored properties. These are not output as state in components.
 */
  getOmittedProperties(){
      return [...this.getRelations(), 'id', 'created_at', 'updated_at', 'schema'];
  }

}

export default HasReflection