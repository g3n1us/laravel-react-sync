import Trait from './Trait';

/**
@kind mixin
@extends Trait
@todo WIP!!!
*/
class HasKeyProp extends Trait{

	/** */
  constructor(targetClass){
    super(targetClass);
  }

	/** */
  static make_key(id, prefix = ''){
    return `${prefix}_${this.plural}_${id}`;
  }


	/** */
  unique_key(prefix = ''){
    return `${prefix}_${this.plural}_${this.id}`;
  }

	/** */
  get key(){
    return this.unique_key();
  }

}

export default HasKeyProp;
