import React, { Component } from 'react';
import { Page } from 'laravel_react_sync';

class {{$name}} extends Page {

    render() {
		return (<h2>{this.constructor.name}</h2>);
    }

}

export default {{$name}}
