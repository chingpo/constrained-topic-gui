import axios from 'axios';
const BASE_URL= 'http://136.187.82.204:18080'
export const IMG_BASE_URL= 'http://136.187.116.134:18080/web/images/'
export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});