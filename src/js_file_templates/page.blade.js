import React, { Component } from 'react';
import { Page } from 'laravel_react_sync';
{{$js_import}}
class {{$name}} extends Page {
	{{$renders}}
	renderDefault() {
		{{$render_body}}
	}

}

export default {{$name}}
