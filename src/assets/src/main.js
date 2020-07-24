import { Pagination, Page, Model, Field, Form, Notification, PageNav } from './components';

import * as helpers from './helpers';

import * as extras from './extras';

import * as layouts from './Layouts';

export * from './Layouts';

import ReactSync from './ReactSync';

import Reducer from './Reducer';

import { on, dispatch } from './Event';

import collect from './collect.js';


/** */
const LaravelReactSync = {
	...extras,
	...layouts,
	collect,
	helpers,
	on,
	dispatch,
	Pagination,
	Page,
	Model,
	Field,
	Form,
	Notification,
	PageNav,
	ReactSync,
	Reducer,
};

//export const {...rest} = layouts;


export {
	extras,
	helpers,
	collect,
	on,
	dispatch,
	Pagination,
	Page,
	Model,
	Field,
	Form,
	Notification,
	PageNav,
	ReactSync,
	Reducer,
};

export default LaravelReactSync;
