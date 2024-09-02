import ToolbarComponent from '../components/toolbar.comp'
import { Outlet } from 'react-router-dom'

function Layout() {
    return (
        <div className='h-[100%] w-[100%]'>
            <ToolbarComponent />
            <div className='grow sm:px-[2.75%] md:px-[2.75%] xl:px-[2.75%] py-10  flex flex-col gap-2 overflow-auto h-[100%]'>
                <Outlet />
            </div>
        </div >
    )
}

export default Layout