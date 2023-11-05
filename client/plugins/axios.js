import axios from 'axios';


// axios.defaults.baseURL = 'https://api.clockify.me/api';
axios.default.baseURL = 'http://localhost:100/api/'

// axios.defaults.headers.common['x-api-key'] = 'Y2JhYWYyYWQtZmFjZi00YzllLWEyZWItNjNlYTI5ZTYwYWRi' //! hide this key

export default axios;