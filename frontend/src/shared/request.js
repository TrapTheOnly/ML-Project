import axios from 'axios'
import ROUTES from './constants';

const route = ROUTES.backendDevURL;

// ! Search
export function searchPage(data) {
    return axios.create({
        baseURL: route,
        timeout: 30000,
    }).post('/', data)
}