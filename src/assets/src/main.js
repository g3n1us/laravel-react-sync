import { Pagination, Page, Model, Field, Form, Notification, PageNav } from './components';

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

fetchClient

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
	ReactSync,
	Reducer,
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
};

export default LaravelReactSync;
