import { Alert, Pagination, MasterComponent } from '../LaravelReactSync';

import Model from './Model';

import Field from './Field';

import * as helpers from './helpers';

const LaravelReactSync = { Alert, Pagination, MasterComponent, Model, ModelComponent: Model, helpers, Field };

require('./components/Notification');

export default LaravelReactSync;
