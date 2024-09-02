import axios from 'axios';
import { api } from '../constants';
import { ParamGetTasks, ParamUpdateTaskStatus, PropDciTask, PropStatistic, PropStatus } from '../model/task.model';
const http = axios.create({
    baseURL: api,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8;json/html; charset=UTF-8',
    }
})
export function APIGetTasks(param: ParamGetTasks) {
    return new Promise<PropDciTask[]>(resolve => {
        http.post('/GetTasks', param).then((res) => {
            resolve(res.data);
        })
    })
}

export function APIGetTaskById(taskId: number) {
    return new Promise<PropDciTask>(resolve => {
        http.get(`/GetTaskById/${Number(taskId)}`).then((res) => {
            resolve(res.data);
        })
    })
}

export function APIRejectTask(taskId: number, empcode: string) {
    return new Promise<PropStatus>(resolve => {
        http.get(`/RejectTask/${taskId}/${empcode}`).then((res) => {
            resolve(res.data);
        })
    })
}
export function APIDeleteTask(taskId: number, code: string) {
    return new Promise<PropStatus>(resolve => {
        http.get(`/DeleteTask/${taskId}/${code}`).then((res) => {
            resolve(res.data);
        })
    })
}
export function APIInsertTask(param: PropDciTask) {
    return new Promise<PropStatus>(resolve => {
        http.post('/InsertTask', param).then((res) => {
            resolve(res.data);
        })
    })
}

export function APIUpdateTaskStatus(param: ParamUpdateTaskStatus) {
    return new Promise<PropStatus>(resolve => {
        http.post('/UpdateTaskStatus', param).then((res) => {
            resolve(res.data);
        })
    })
}



export function APIGetStatistic(empcode: string) {
    return new Promise<PropStatistic>(resolve => {
        http.get(`/GetStatistic/${empcode}`).then((res) => {
            resolve(res.data);
        })
    })
}

export function APIEditTask(param: PropDciTask) {
    return new Promise<PropStatus>(resolve => {
        http.post('/EditTask', param).then((res) => {
            resolve(res.data);
        })
    })
}

export function APIGetCreateBys() {
    return new Promise<string[]>(resolve => {
        http.get('/GetCreateBys').then((res) => {
            resolve(res.data);
        })
    })
}