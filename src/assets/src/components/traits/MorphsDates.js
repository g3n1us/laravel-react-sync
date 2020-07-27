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
		let { dates, dateFormat } = this.model_properties
		if(this.dateFormat) dateFormat = this.dateFormat;

		dates.forEach(d => {
    		const props = this.props || {};

    		const mmnt = moment(props[d]).format(dateFormat);

			Object.defineProperty(this, d, {
				value: mmnt,
			});
		});
    }

}

export default MorphsDates;
