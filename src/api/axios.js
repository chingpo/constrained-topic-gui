import axios from 'axios';
const BASE_URL= 'http://136.187.116.134:13000'
export const IMG_BASE_URL= 'http://136.187.116.134:18080/web/topic/topic_patches/'
export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json','Accept': 'application/json' },
    withCredentials: true
});