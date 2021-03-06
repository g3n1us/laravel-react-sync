import { Pagination, Page, Model, Field, Form, Notification, PageNav, Table } from './components';

import * as helpers from './helpers';

import * as extras from './extras';

import * as layouts from './Layouts';

export * from './Layouts';

import ReactSync from './ReactSync';

import Reducer from './Reducer';

import { on, dispatch } from './Event';

import collect from './collect.js';

export { navigate } from './fetchClient';

import fetchClient from './fetchClient';

import { app } from './App';
/** */
const LaravelReactSync = {
	...extras,
	...layouts,
	collect,
	helpers,
	fetchClient,
	on,
	dispatch,
	Pagination,
	Page,
	Model,
	Field,
	Form,
	Notification,
	PageNav,
	Table,
	ReactSync,
	Reducer,
	app,
};

//export const {...rest} = layouts;


export {
	extras,
	helpers,
	collect,
	fetchClient,
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
	Table,
	app,
};

export default LaravelReactSync;
