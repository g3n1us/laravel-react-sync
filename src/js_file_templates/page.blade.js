import React, { Component } from 'react';
import { MasterComponent } from 'laravel_react_sync';

class {{$name}} extends MasterComponent {

    render() {
		return (<h2>{this.constructor.name}</h2>);
    }

}

export default {{$name}}
