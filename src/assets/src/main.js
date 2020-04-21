import { Pagination, Page, Model, Field, Form, Notification } from './components';

import * as helpers from './helpers';

import * as extras from './extras';

import ReactSync from './ReactSync';

import { on, dispatch } from './Event';


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
	ReactSync
};

// require('./components/Notification');

export default LaravelReactSync;
