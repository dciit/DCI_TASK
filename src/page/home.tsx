import { useEffect, useState } from 'react';
import { Button, Col, Dropdown, notification, Popconfirm, Row, Select, Statistic, Table, Tag } from 'antd';
import type { MenuProps, TableProps } from 'antd';
import { APIDeleteTask, APIGetCreateBys, APIGetStatistic, APIGetTasks, APIRejectTask, APIUpdateTaskStatus } from '../service/task.service';
import moment from 'moment';
import { DatePicker }
    from
    "antd"
    ;
import dayjs from 'dayjs';
import { MoreOutlined, SearchOutlined, CloseCircleOutlined, PlusCircleOutlined, CheckCircleOutlined, FireOutlined, DeleteOutlined, CloseOutlined, CheckOutlined, ThunderboltOutlined, EditOutlined } from '@ant-design/icons';
import { PropDciTask, PropSelectAnt, PropStatistic, PropTaskFilter } from '../model/task.model';
import { useSelector } from 'react-redux';
import DialogAddTask from '../components/dialog.add.task';
import { contact } from '../constants';
import DialogEditTask from '../components/dialog.edit.task';
const { RangePicker } = DatePicker;
type NotificationType = 'success' | 'info' | 'warning' | 'error';
// taskId: number;
// taskTitle: string;
// taskDesc: string;
// taskPriority: string;
// taskStatus: string;
// taskCreateBy: string;
// taskCreateDt: Date;
// taskUpdateBy: string;
// taskUpdateDt: Date;




function Home() {
    const redux = useSelector((state: any) => state.redux);
    const empcode = redux.empcode;
    const [api, contextHolder] = notification.useNotification();
    const [taskIdEdit, setTaskIdEdit] = useState<number>(0);
    const [openDialogEditTask, setOpenDialogEditTask] = useState<boolean>(false);
    const [openAddTask, setOpenAddTask] = useState<boolean>(false);
    const [dtST] = useState<string>(moment().format('YYYY0101'));
    const [dtFN] = useState<string>(moment().format('YYYYMMDD'));
    const [tasks, setTasks] = useState<PropDciTask[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [taskCreateBys, setTaskCreateBys] = useState<PropSelectAnt[]>([]);
    const [statistic, setStatistic] = useState<PropStatistic>({
        total: 0,
        done: 0,
        doing: 0,
        reject: 0
    })
    const [filter, setFilter] = useState<PropTaskFilter>({
        taskDateStart: dtST,
        taskDateEnd: dtFN,
        taskPriority: '',
        taskStatus: '',
        taskCreateBy: ''
    })
    useEffect(() => {
        init();
    }, []);
    const init = async () => {
        setLoading(true);
        let RESGetCreateBys = await APIGetCreateBys();
        if (RESGetCreateBys != null && Object.keys(RESGetCreateBys).length) {
            setTaskCreateBys(RESGetCreateBys.map((e: any) => { return { label: e.fullName, value: e.code } }));
        }
        let RESGetTasks = await APIGetTasks({
            dtST: filter.taskDateStart,
            dtFN: filter.taskDateEnd,
            taskStatus: filter.taskStatus,
            taskPriority: filter.taskPriority,
            taskCreateBy: filter.taskCreateBy
        });
        setTasks(RESGetTasks);
        if (empcode != '' && empcode != null) {
            let RESGetStatistic = await APIGetStatistic(empcode);
            setStatistic(RESGetStatistic);
        }
        setLoading(false);
    }
    const handleUpdate = async (taskId: number, taskAction: boolean) => { // ACTION = true => NEXT STEP, ACTION = false => BACK STEP
        let RESUpdateTask = await APIUpdateTaskStatus({
            taskId: taskId,
            taskAction: taskAction,
            taskUpdateBy: empcode
        })
        if (RESUpdateTask.status == true) {
            openNotification('success', 'อัพเดรตงานสําเร็จ');
        } else {
            openNotification('error', `อัพเดรตงานไม่สําเร็จ ${RESUpdateTask.message} ${contact}`);
        }
        init();
    }
    const handleDelete = async (taskId: number) => {
        let RESDeleteTask = await APIDeleteTask(taskId, empcode);
        if (RESDeleteTask.status == true) {
            openNotification('success', 'ลบงานสําเร็จ');
        } else {
            openNotification('error', `ลบงานไม่สําเร็จ ${RESDeleteTask.message} ${contact}`);
        }
        init();
    }

    const handleReject = async (taskId: number) => {
        let RESReject = await APIRejectTask(taskId, empcode);
        if (RESReject.status == true) {
            openNotification('success', 'ยกเลิกงานสําเร็จ');
        } else {
            openNotification('error', `ยกเลิกงานไม่สําเร็จ ${RESReject.message} ${contact}`);
        }
        init();
    }

    const openNotification = (type: NotificationType, message: string) => {
        api[type]({
            message: message
        });
    };

    useEffect(() => {
        if (taskIdEdit > 0) {
            setOpenDialogEditTask(true);
        }
    }, [taskIdEdit])

    const columns: TableProps<PropDciTask>['columns'] = [
        {
            title: 'ID',
            dataIndex: 'taskId',
            key: 'taskId',
            align: 'center',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Title',
            dataIndex: 'taskTitle',
            key: 'taskTitle',
            render: (text) => <strong>{text}</strong>,
        },
        {
            title: 'Description',
            dataIndex: 'taskDesc',
            key: 'taskDesc',
        },
        {
            title: 'Priority',
            key: 'taskPriority',
            dataIndex: 'taskPriority',
            render: (tag) => {
                let color = tag === 'normal' ? 'green' : tag === 'medium' ? 'volcano' : 'red';
                let icon = tag === 'normal' ? '' : tag === 'medium' ? '' : <FireOutlined />
                return (
                    <Tag color={color} key={tag} icon={icon}>
                        {tag.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: 'Due date',
            key: 'taskDuedate',
            align: 'center',
            dataIndex: 'taskDuedate',
            render: (text) => <div className='flex items-center flex-col'>
                <p>{moment(text).format('DD/MM/YYYY')}</p>
                <p>{moment(text).format('HH:mm:ss')}</p>
            </div>,
        },
        {
            title: 'Status',
            key: 'taskStatus',
            dataIndex: 'taskStatus',
            align: 'center',
            render: (tag, o) => {
                let updateDT = o.taskUpdateDt;
                let updateBY = o.taskUpdateBy;
                let color = tag === 'create' ? '#006fff' : tag === 'doing' ? '#ff8000' : tag === 'done' ? '#4caf50' : '#f50';
                let icon = tag === 'done' ? <CheckOutlined /> : tag === 'doing' ? <ThunderboltOutlined /> : <CloseOutlined />
                return (
                    <div className='flex flex-col items-center justify-center gap-1'>
                        <small className='font-semibold'>{updateBY}</small>
                        <Tag color={color} key={tag} className='m-0' icon={icon}>
                            {tag.toUpperCase()}
                        </Tag>
                        <small>{moment(updateDT).format('DD/MM/YYYY HH:mm:ss')}</small>
                    </div>
                );
            },
        },
        {
            title: 'Action',
            align: 'center',
            render: (_, o) => {
                const items: MenuProps['items'] = [];
                let taskStatus = o.taskStatus;
                if (taskStatus === 'doing' && o.taskCreateBy == empcode) {
                    items.push({
                        key: '0', label: <Popconfirm
                            title="Done the task"
                            description="Are you sure to Done this task?"
                            okText="Yes"
                            cancelText="No"
                            onConfirm={() => handleUpdate(o.taskId, true)}
                        >
                            <div className='flex  gap-1 items-center' >
                                <CheckCircleOutlined className='opacity-50' />
                                <span>Done</span>
                            </div>
                        </Popconfirm>
                    });

                    items.push({
                        key: '1', label:
                            <div className='flex  gap-1 items-center' onClick={() => setTaskIdEdit(o.taskId)}>
                                <EditOutlined className='opacity-50' />
                                <span>Edit</span>
                            </div>
                    });
                    items.push({
                        key: '2', danger: false, label: <Popconfirm
                            title="Reject the task"
                            description="Are you sure to Reject this task?"
                            okText="Yes"
                            cancelText="No"
                            onConfirm={() => handleReject(o.taskId)}
                        >
                            <div className='flex  gap-1 items-center' >
                                <CloseCircleOutlined className='opacity-50' />
                                <span>Reject</span>
                            </div>
                        </Popconfirm>
                    });
                    items.push({
                        key: '3', danger: true, label: <Popconfirm
                            title="Delete the task"
                            description="Are you sure to delete this task?"
                            okText="Yes"
                            cancelText="No"
                            onConfirm={() => handleDelete(o.taskId)}
                        >
                            <div className='flex  gap-1 items-center' >
                                <DeleteOutlined className='opacity-50' />
                                <span>Delete</span>
                            </div>
                        </Popconfirm>
                    });
                }
                return (
                    <Dropdown menu={{ items }} placement="bottomLeft" arrow disabled={!items.length}>
                        <Button><MoreOutlined />
                        </Button>
                    </Dropdown>
                );
            },
        },
    ];

    const handleSearch = async () => {
        init();
    }
    return <div className='grid grid-cols-1 gap-4 select-none'>
        <div className='shadow-sm border rounded-md px-3 pb-3 pt-2'>
            <div className='mb-1'>เครื่องมือค้นหา</div>
            <RangePicker value={[dayjs(filter.taskDateStart), dayjs(filter.taskDateEnd)]} allowClear={false} onCalendarChange={(value) => setFilter({ ...filter, taskDateStart: dayjs(value[0]).format('YYYYMMDD'), taskDateEnd: dayjs(value[1]).format('YYYYMMDD') })} />
            <Select className='ml-3' options={[...[{ value: '', label: 'ผู้สร้างทั้งหมด' }], ...taskCreateBys]} optionFilterProp="label" showSearch value={filter.taskCreateBy} placeholder="เลือกผู้สร้าง" onChange={(value) => setFilter({ ...filter, taskCreateBy: value })} />
            <Select
                className='ml-3'
                showSearch
                placeholder="เลือกสถานะ"
                optionFilterProp="label"
                onChange={(value) => setFilter({ ...filter, taskStatus: value })}
                value={filter.taskStatus}
                options={[
                    {
                        value: '',
                        label: 'สถานะทั้งหมด',
                    },
                    {
                        value: 'doing',
                        label: 'Doing',
                    },
                    {
                        value: 'done',
                        label: 'Done',
                    },
                    {
                        value: 'reject',
                        label: 'Reject',
                    },
                ]}
            />
            <Select
                className='ml-3'
                showSearch
                placeholder="เลือกความสำคัญ"
                optionFilterProp="label"
                onChange={(value) => setFilter({ ...filter, taskPriority: value })}
                value={filter.taskPriority}
                options={[
                    {
                        value: '',
                        label: 'ความสำคัญทั้งหมด',
                    },
                    {
                        value: 'normal',
                        label: 'Normal',
                    },
                    {
                        value: 'medium',
                        label: 'Medium',
                    },
                    {
                        value: 'high',
                        label: 'High',
                    },
                ]}
            />
            <Button type='primary' className='ml-3' icon={<SearchOutlined />} onClick={handleSearch}>ค้นหา</Button>
        </div>
        <div className='border rounded-md p-6 flex flex-col justify-center gap-3'>
            <div className='flex items-center justify-between'>
                <Row className='grow' gutter={16}>
                    <Col span={6}>
                        <Statistic title="Total Task" value={typeof statistic.total != 'undefined' ? statistic.total : 0} valueStyle={{ color: '#006fff' }} />
                    </Col>
                    <Col span={6}>
                        <Statistic title="Done" value={typeof statistic.done != 'undefined' ? statistic.done : 0} valueStyle={{ color: 'green' }} />
                    </Col>
                    <Col span={6}>
                        <Statistic title="Doing" value={typeof statistic.doing != 'undefined' ? statistic.doing : 0} valueStyle={{ color: '#FF8000' }} />
                    </Col>
                    <Col span={6}>
                        <Statistic title="Reject" value={typeof statistic.reject != 'undefined' ? statistic.reject : 0} valueStyle={{ color: '#FF5500' }} />
                    </Col>
                </Row>
                <div className='flex items-end justify-end flex-none'>
                    <Button type='primary' icon={<PlusCircleOutlined />} onClick={() => setOpenAddTask(true)} disabled={!redux.login} title={!redux.login ? 'กรุณาเข้าสู่ระบบ' : ''}>สร้างงาน</Button>
                </div>
            </div>
            <Table columns={columns} dataSource={tasks} loading={loading} className='shadow-md rounded-md border' size='small' />
        </div>
        <DialogAddTask open={openAddTask} setOpen={setOpenAddTask} loadTask={init} />
        <DialogEditTask open={openDialogEditTask} setOpen={setOpenDialogEditTask} taskId={taskIdEdit} setTaskId={setTaskIdEdit} loadTasks={init} />
        {contextHolder}
    </div>
}

export default Home;