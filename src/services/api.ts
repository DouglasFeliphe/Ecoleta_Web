import axios from 'axios';
import { deflate } from 'zlib';

const api = axios.create({
    baseURL: 'https://nlw-ecoleta-web.herokuapp.com/'
})

export default api