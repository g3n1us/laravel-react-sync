import Trait from './Trait';
import moment from 'moment';
window.moment = moment;
/**
@kind mixin
@extends Trait
*/
class MorphsDates extends Trait{

    constructor(targetClass){
        super(targetClass);
    }

    getDates(){
	    const { moment_dates } = this.props;
	    console.log('moment_dates', moment_dates);
		let { dateFormat } = this.model_properties
		if(this.dateFormat) dateFormat = this.dateFormat;

		Object.keys(moment_dates).forEach(d => {
    		const props = this.props || {};

    		const mmnt = moment(moment_dates[d]).format(dateFormat);

			Object.defineProperty(this, d, {
				value: mmnt,
			});
		});
    }

}

export default MorphsDates;
