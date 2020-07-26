import Trait from './Trait';
import moment from 'moment';

/**
@kind mixin
@extends Trait
*/
class MorphsDates extends Trait{

    constructor(targetClass){
        super(targetClass);
    }

    getDates(){
		const dates = _.toPairs(this.schema).filter(tuple => tuple[1].type.match(/date.*?/)).map(tuple => tuple[0]);
		dates.forEach(d => {
			Object.defineProperty(this, d, {
				value: new moment(this.props[d]),
			});
		});
    }

}

export default MorphsDates;
