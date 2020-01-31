import { Pagination, Page, Model, Field, Form, Notification } from './components';

import * as helpers from './helpers';

import * as extras from './extras';

import ReactSync from './ReactSync';

const LaravelReactSync = {
	...extras,
	helpers,
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
