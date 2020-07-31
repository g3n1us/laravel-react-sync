import _axios from 'axios';
import ReactSync from './ReactSync';
import Reducer from './Reducer';
import { dispatch } from './Event';

if (history.scrollRestoration) {
    history.scrollRestoration = 'auto';
}

const ReactSyncInstance = new ReactSync;

const fetchClient = () => {
  const defaultOptions = {
    // baseURL: process.env.REACT_APP_API_PATH,
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'X-React-Sync-Update': 'true',
      'X-Requested-With': 'XMLHttpRequest',
    },
  };

  // Create instance
  let instance = _axios.create(defaultOptions);

  // Set the AUTH token for any request
/*
  instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    config.headers.Authorization =  token ? `Bearer ${token}` : '';
    return config;
  });

  axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
*/

  return instance;
};

const axios = fetchClient();

const navigate = (e) => {
	if(!ReactSyncInstance.route.controller) return;
	let url;

	if(typeof e === 'string'){
    	// this is just a url, not an event handler
    	url = e;
	}
	else {
    	e.preventDefault();
    	url = e.target.href;
	}


    dispatch('navigating', e);

	fetchClient().get(url)
		.then(response => {
			history.pushState(response.data, "", url);
			updatePage(response.data);
			dispatch('navigated', e);
	});
}


const updatePage = (data) => {
    debugger
	const { page_class } = ReactSyncInstance.route.controller;
	if(page_class !== data.page_class){
		const containing_div = document.querySelector(`[data-react-render="${page_class}"]`);
		containing_div.setAttribute('data-react-render', data.page_class);
	}

	ReactSyncInstance.route.controller = data;
	app().setState(Reducer());
}

window.addEventListener('popstate', function(e) {
	const data = e.state || ReactSyncInstance.initialData;
	updatePage(data);
	return true;
});

export { navigate, axios };

export default axios;
