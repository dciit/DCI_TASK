import {  useState } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Avatar,  Popconfirm } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { motion } from "framer-motion";
import DialogLogin from './dialog.login';
function ToolbarComponent() {
    let comp = window.location.pathname.split("/").pop();
    comp = comp == '' ? 'main' : comp;
    const dispatch = useDispatch();
    const redux = useSelector((state: any) => state.redux);
    const login = redux.login;
    const empcode = redux.empcode;
    const [openDialogLogin, setOpenDialogLogin] = useState<boolean>(false);
    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
        setTimeout(() => {
            location.reload();
        }, 500);
    }
    return (
        <div className='flex  items-center h-[50px] shadow-sm border-b px-6'>
            <div className='flex-none font-bold drop-shadow-md'>DCI TASK</div>
            <div className='grow'></div>
            <div className='flex-none'>
                <div className='flex gap-2 items-center'>
                    {
                        login ?

                            <Popconfirm
                                title="ออกจากระบบ"
                                description="คุณแน่ใจว่าต้องการออกจากระบบ ใช่หรือไม่ ?"
                                onConfirm={handleLogout}
                                okText="Yes"
                                cancelText="No"
                            >
                                <div className='flex items-center gap-1' >
                                    <Avatar src={`http://dcidmc.dci.daikin.co.jp/PICTURE/${empcode}.JPG`} size={36} />
                                    <span>{redux.name}.{redux.surn.substring(0, 1)}</span>
                                </div>
                            </Popconfirm>
                            :
                            <motion.div whileHover={{ scale: 1.1 }} onClick={() => setOpenDialogLogin(true)} >
                                <div className='flex  items-center gap-1 cursor-pointer select-none'>
                                    <UserOutlined />
                                    <small>เข้าสู่ระบบ</small>
                                </div>
                            </motion.div>
                    }
                </div>
            </div>
            <DialogLogin open={openDialogLogin} setOpen={setOpenDialogLogin} />
        </div>
    )
}

export default ToolbarComponent