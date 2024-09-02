import { Button, DatePicker, Flex, Input, Modal, notification, Select } from 'antd'
import { useEffect, useState } from 'react'
import { APIEditTask, APIGetTaskById } from '../service/task.service';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import moment from 'moment';
import { SoundOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux';
import { PropDciTask } from '../model/task.model';
interface ParamDialogEditTask {
    open: boolean;
    setOpen: Function;
    taskId: number;
    setTaskId: Function;
    loadTasks: Function;
}
type NotificationType = 'success' | 'info' | 'warning' | 'error';
function DialogEditTask(props: ParamDialogEditTask) {
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (type: NotificationType, message: string) => {
        api[type]({
            message: message,
        });
    };
    const [taskWarning, setTaskWarning] = useState<number>(7);
    const { open, setOpen, taskId, setTaskId, loadTasks } = props;
    const redux = useSelector((state: any) => state.redux);
    const empcode = redux.empcode;
    const [load, setLoad] = useState<boolean>(true);
    const [wait, setWait] = useState<boolean>(false)
    const [task, setTask] = useState<PropDciTask>({
        taskId: 0,
        taskTitle: '',
        taskDesc: '',
        taskDuedate: new Date(),
        taskWarning: 7,
        taskPriority: 'normal',
        taskStatus: '',
        taskUpdateBy: empcode,
        taskUpdateDt: new Date(),
        taskCreateBy: empcode,
        taskCreateDt: new Date()
    });
    useEffect(() => {
        if (open == true) {
            loadTask();
        } else {
            setTaskId(0);
            setLoad(true);
        }
    }, [open])
    const loadTask = async () => {
        setLoad(true);
        let RESGetTaskById = await APIGetTaskById(taskId);
        setTask({ ...task, ...RESGetTaskById });
        setTaskWarning(7);
    }
    useEffect(() => {
        setLoad(false)
    }, [task])
    const handleEdit = async () => {
        setWait(true);
        try {
            let RESEditTask = await APIEditTask(task);
            if (RESEditTask.status) {
                openNotification('success', 'แก้ไขงานสําเร็จ')
                setWait(false);
            } else {
                openNotification('error', `แก้ไขงานไม่สําเร็จ เนื่องจาก ${RESEditTask.message}`)
                setWait(false)
            }
            loadTasks();
        } catch (e: Error | any) {
            openNotification('error', e.message)
            setWait(false);
        }
    }
    return (
        <Modal open={open} loading={load} onCancel={() => setOpen(false)} onClose={() => setOpen(false)} title='แก้ไขงาน' footer={
            <Flex gap={6} justify='end'>
                <Button type='primary' onClick={handleEdit} loading={wait}>บันทึก</Button>
                <Button onClick={() => setOpen(false)} disabled={wait}>ปิดหน้าต่าง</Button>
            </Flex>
        }>
            <div className='flex flex-col gap-3 p-6'>
                <div className='flex flex-col gap-1'>
                    <span>ผู้สร้าง</span>
                    <Input type='text' value={empcode} readOnly={true} />
                </div>
                <div className='flex flex-col gap-1'>
                    <span>เรื่อง</span>
                    <Input type='text' value={task.taskTitle} onChange={(e) => setTask({ ...task, taskTitle: e.target.value })} placeholder='กรุณากรอกชื่องาน' />
                </div>
                <div className='flex flex-col gap-1'>
                    <span>ความสำคัญ</span>
                    <Select placeholder="กรุณาเลือกความสําคัญ" value={task.taskPriority} onChange={(e) => setTask({ ...task, taskPriority: e })}>
                        <Select.Option value="normal">Normal</Select.Option>
                        <Select.Option value="medium">Medium</Select.Option>
                        <Select.Option value="high">High</Select.Option>
                    </Select>
                </div>
                <div className='grid grid-cols-3 gap-3 '>
                    <div className='col-span-1 flex flex-col gap-1'>
                        <span>แจ้งเตือนล่วงหน้า&nbsp;<SoundOutlined /></span>
                        <Input min={7} type='number' value={taskWarning} onChange={(e) => {
                            setTask({ ...task, taskWarning: parseInt(e.target.value), taskDuedate: new Date(moment().add(parseInt(e.target.value), 'days').format('YYYY-MM-DD HH:mm:ss')) })
                            setTaskWarning(parseInt(e.target.value))
                        }} />
                    </div>
                    <div className='col-span-2 flex flex-col gap-1'>
                        <span>กำหนดเสร็จสิ้น</span>
                        <DatePicker value={dayjs(task.taskDuedate)} allowClear={false} onChange={(e) => {
                            setTask({ ...task, taskDuedate: new Date(dayjs(e).format('YYYY-MM-DD HH:mm:ss')) })
                            setTaskWarning(dayjs(e).diff(dayjs(), 'day'))
                        }} />
                    </div>
                </div>
                <div className='flex flex-col gap-1'>
                    <span>รายละเอียด</span>
                    <TextArea placeholder='กรอกรายละเอียดงาน' rows={5} value={task.taskDesc} onChange={(e) => setTask({ ...task, taskDesc: e.target.value })} />
                </div>
                {contextHolder}
            </div>
        </Modal >
    )
}

export default DialogEditTask