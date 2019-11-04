import { Alert, Pagination, MasterComponent } from '../LaravelReactSync';

import Model from './Model';

import * as helpers from './helpers';

const LaravelReactSync = { Alert, Pagination, MasterComponent, Model, ModelComponent: Model, helpers };

require('./components/Notification');

export default LaravelReactSync;
