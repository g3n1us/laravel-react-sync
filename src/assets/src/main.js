import { Pagination, Page, Model, Field, Form, Notification, PageNav } from './components';

import * as helpers from './helpers';

import * as extras from './extras';

import ReactSync from './ReactSync';

import Reducer from './Reducer';

import { on, dispatch } from './Event';

/** */
const LaravelReactSync = {
	...extras,
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

export {
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

export default LaravelReactSync;
