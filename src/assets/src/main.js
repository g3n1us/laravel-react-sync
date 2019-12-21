import { Pagination, Page, Model, Field, Form, Notification } from './components';

import * as helpers from './helpers';

import * as extras from './extras';

const LaravelReactSync = {
	...extras,
	helpers,
	Pagination,
	Page,
	Model,
	Field,
	Form,
	Notification,
};

// require('./components/Notification');

export default LaravelReactSync;
