import { Alert, Button, DatePicker, Flex, Input, Modal, notification, Select } from 'antd'
import { useEffect, useState } from 'react'
import { PropDciTask } from '../model/task.model';
import { useSelector } from 'react-redux';
import { PlusOutlined, SoundOutlined } from '@ant-design/icons'
import TextArea from 'antd/es/input/TextArea';
import { APIInsertTask } from '../service/task.service';
import type { NotificationArgsProps } from 'antd';
import moment from 'moment';
import dayjs from 'dayjs';

type NotificationPlacement = NotificationArgsProps['placement'];
interface ParamDialogAddTask {
    open: boolean;
    setOpen: Function;
    loadTask: Function;
}
function DialogAddTask(props: ParamDialogAddTask) {
    const [loading, setLoading] = useState(false);
    const redux = useSelector((state: any) => state.redux);
    const empcode = redux.empcode;
    const [api, contextHolder] = notification.useNotification();
    const { open, setOpen, loadTask } = props;
    const [showError, setShowError] = useState<boolean>(false);
    const [messageError, setMessageError] = useState<string>('');
    const [taskWarning, setTaskWarning] = useState<number>(7);
    const [task, setTask] = useState<PropDciTask>({
        taskId: 0,
        taskTitle: '',
        taskDesc: '',
        taskDuedate: new Date(moment().add(taskWarning, 'days').format('YYYY-MM-DD HH:mm:ss')),
        taskWarning: taskWarning,
        taskPriority: 'normal',
        taskStatus: '',
        taskUpdateBy: empcode,
        taskUpdateDt: new Date(),
        taskCreateBy: empcode,
        taskCreateDt: new Date()
    });
    useEffect(() => {
        if (open) {
            setLoading(false);
            setTask({ ...task, taskTitle: '', taskDesc: '' })
        }
    }, [open])
    useEffect(() => {
        setTask({ ...task, taskCreateBy: empcode, taskUpdateBy: empcode })
    }, [redux])
    const handleAddTask = async () => {
        setLoading(true);
        try {
            let RESAddTask = await APIInsertTask(task);
            if (RESAddTask.status == true) {
                openNotification('topRight');
                loadTask();
            } else {
                setShowError(true);
                setMessageError('สร้างงานไม่สําเร็จ');
            }
            setTimeout(() => {
                setLoading(false);
                setOpen(false);
            }, 1000);
        } catch (e: Error | any) {
            setShowError(true);
            setMessageError(e.message);
            setLoading(false);
        }
    }
    const openNotification = (placement: NotificationPlacement) => {
        api.success({
            message: `แจ้งเตือน `,
            description:
                'เพิ่มรายการงานสำเร็จแล้ว',
            placement,
        });
    };
    useEffect(() => {
        setTask({ ...task, taskWarning: taskWarning })
    }, [taskWarning])
    return (
        <Modal title="สร้างงานของคุณ" open={open} onCancel={() => setOpen(false)} onClose={() => loading == true ? () => undefined : setOpen(false)} footer={
            <Flex gap={6} justify='end'>
                <Button loading={loading} onClick={() => handleAddTask()} type='primary' icon={<PlusOutlined />} disabled={!task.taskTitle || !task.taskDesc || !task.taskPriority}>สร้าง</Button>
                <Button onClick={() => setOpen(false)} disabled={!task.taskTitle || !task.taskDesc || !task.taskPriority || !task.taskDuedate || loading}>ปิดหน้าต่าง</Button>
            </Flex>
        }>
            {contextHolder}
            <div className='flex flex-col gap-3 p-6'>
                <div className='flex flex-col gap-1'>
                    <span>สร้างโดย</span>
                    <Input type='text' disabled={true} value={empcode} />
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
                        <Input min={7} type='number' value={task.taskWarning} onChange={(e) => {
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
                {
                    showError && <Alert
                        message="เกิดข้อผิดพลาด"
                        description={messageError}
                        type="error"
                        showIcon
                        closeIcon={true}
                        onClose={() => {
                            setShowError(false);
                            setMessageError('');
                        }}
                    />
                }
            </div>
        </Modal>
    )
}

export default DialogAddTask