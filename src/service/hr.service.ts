import axios from 'axios';
import { apiHR } from '../constants';
import { PropUser } from '../model/hr.model';
const http = axios.create({
    baseURL: apiHR,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8;json/html; charset=UTF-8',
    }
})
export function APILogin(code: string) {
    return new Promise<PropUser>(resolve => {
        http.get(`/login/${code}`).then((res) => {
            resolve(res.data);
        })
    })
}