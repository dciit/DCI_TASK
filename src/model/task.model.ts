export interface ParamGetTasks {
    dtST: string;
    dtFN: string;
    taskStatus: string;
    taskPriority: string;
    taskCreateBy: string;
}
export interface PropDciTask {
    taskId: number;
    taskTitle: string;
    taskDesc: string;
    taskPriority: string;
    taskDuedate: Date;
    taskWarning: number;
    taskStatus: string;
    taskCreateBy: string;
    taskCreateDt: Date;
    taskUpdateBy: string;
    taskUpdateDt: Date;
}
export interface PropStatus {
    message: string;
    status: boolean;
}
export interface ParamUpdateTaskStatus {
    taskAction: boolean;
    taskId: number;
    taskUpdateBy: string;
}
export interface PropTaskFilter {
    taskStatus: string;
    taskPriority: string;
    taskDateStart: string;
    taskDateEnd: string;
    taskCreateBy: string;
}
export interface PropStatistic {
    total: number;
    done: number;
    doing: number;
    reject: number;
}
export interface PropSelectAnt {
    value: any;
    label: string;
}