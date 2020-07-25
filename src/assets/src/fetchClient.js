import _axios from 'axios';
import ReactSync from './ReactSync';
import Reducer from './Reducer';


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
	e.preventDefault();
	const url = e.target.href;
	fetchClient().get(url)
		.then(response => {
			history.pushState(response.data, "", url);
			const { page_class } = ReactSyncInstance.route.controller;
			if(page_class !== response.data.page_class){
				const containing_div = document.querySelector(`[data-react-render="${page_class}"]`);
				containing_div.setAttribute('data-react-render', response.data.page_class);

			}

			ReactSyncInstance.route.controller = response.data;
			app().setState(Reducer());
	});
}

export { navigate, axios };

export default axios;
