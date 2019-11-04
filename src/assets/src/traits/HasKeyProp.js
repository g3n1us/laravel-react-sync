import Trait from './Trait';

/**
@kind mixin
@extends Trait
@todo WIP!!!
*/
class HasKeyProp extends Trait{

  constructor(targetClass){
    super(targetClass);
  }


  get key(){
    return `_${this.plural}_${this.props.id}`;
  }

}

export default HasKeyProp;
