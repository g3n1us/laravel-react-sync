import React, { Component } from 'react';
import Trait from './Trait';
import moment from 'moment';
window.moment = moment;

/**
@kind mixin
@extends Trait
*/
class MorphsDates extends Trait{

    getDates(){
	    const { moment_dates } = this.props;
		let { dateFormat, casts } = this.model_properties
		if(this.dateFormat) dateFormat = this.dateFormat;

		const replacements = {
			'Y-m-d H:i:s': 'Y-M-D hh:mm:ss',
		}

		dateFormat = replacements[dateFormat] || dateFormat;

		Object.keys(moment_dates).forEach(d => {
			if(casts[d]){
				console.log(casts[d])
				const dateFormatFromCast = casts[d].match(/^.*?:(.*?)$/, '$1')
				if(dateFormatFromCast){
					console.log(dateFormatFromCast);
					dateFormat = dateFormatFromCast[1];
				}
			}

    		const props = this.props || {};

    		// const mmnt = moment(moment_dates[d]).format(dateFormat);
    		const mmnt = moment(moment_dates[d]);

			const D = <ReactDate date={mmnt} dateFormat={dateFormat} />;

			Object.defineProperty(this, d, {
				value: D,
			});
		});
    }

}

class ReactDate extends Component{

	constructor(props){
		super(props);
		this.date = this.props.date;
		this.dateFormat = this.props.dateFormat;
	}

	render(){
		const { date, dateFormat } = this.props;
		return date.format(dateFormat);
	}

}

export default MorphsDates;

// d = moment.utc('2020-07-22T02:07:14+00:00')
// Y-m-d H:i:s
