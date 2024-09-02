import { Alert, Button, Flex, Input, InputRef, Modal, notification } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { APILogin } from '../service/hr.service';
import { contact } from '../constants';
import { useDispatch } from 'react-redux';

interface ParamDialogLogin {
    open: boolean;
    setOpen: Function;
}
type NotificationType = 'success' | 'info' | 'warning' | 'error';
function DialogLogin(props: ParamDialogLogin) {
    const dispath = useDispatch();
    const { open, setOpen } = props
    const [code, setCode] = useState<string>('');
    const inpCodeRef = useRef<InputRef>(null);
    const [showError, setShowError] = useState<boolean>(false);
    const [api, contextHolder] = notification.useNotification();
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        if (open == true && inpCodeRef.current != null) {
            inpCodeRef.current.focus();
        }
    }, [open])
    const handleLogin = async () => {
        setLoading(true);
        let RESLogin = await APILogin(code);
        try {
            if (RESLogin.empcode != '') {
                dispath({ type: 'LOGIN', payload: RESLogin });
                openNotificationWithIcon('success');
                setTimeout(() => {
                    setLoading(false);
                    setOpen(false);
                }, 1000);
            } else {
                setLoading(false);
                setShowError(true);
            }
        } catch (e: Error | any) {
            setShowError(true);
            setLoading(false);
        }
    }
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    const openNotificationWithIcon = (type: NotificationType) => {
        api[type]({
            message: 'เข้าสู่ระบบเรียบร้อยแล้ว'
        });
    };
    return (
        <Modal title='เข้าสู่ระบบ' open={open} onClose={() => setOpen(false)} onCancel={() => setOpen(false)} footer={
            <Flex gap={6} justify='end'>
                <Button type='primary' autoFocus loading={loading} onKeyPress={handleKeyDown} onClick={handleLogin} disabled={code == ''} title={code == '' ? 'กรุณากรอกรหัสพนักงาน' : ''}>เข้าสู่ระบบ</Button>
                <Button onClick={() => setOpen(false)}>ปิดหน้าต่าง</Button>
            </Flex>
        }>
            <div className='flex flex-col gap-3 p-6'>
                {contextHolder}
                <div className='flex flex-col gap-1' onKeyDown={handleKeyDown}>
                    <span>รหัสพนักงาน</span>
                    <Input type='number' allowClear={true} onClear={() => setCode('')} onChange={(e) => {
                        if (e.target.value.length > 5) {
                            setCode(e.target.value.substring(0, 5))
                        } else {
                            setCode(e.target.value)
                        }
                    }} placeholder='กรุณากรอกรหัสพนักงาน' ref={inpCodeRef} value={code}  autoFocus />
                </div>
                {
                    showError ? <Alert message={`ไม่สามารถเข้าสู่ระบบได้ ${contact}`} type="error" showIcon /> : null
                }
            </div>
        </Modal>
    )
}

export default DialogLogin