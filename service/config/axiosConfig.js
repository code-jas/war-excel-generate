import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

axios.defaults.baseURL = process.env.CLOCKIFY_API_URL || 'https://api.clockify.me/api/v1';

axios.defaults.headers.common['x-api-key'] = process.env.CLOCKIFY_API_KEY; 

export default axios;
