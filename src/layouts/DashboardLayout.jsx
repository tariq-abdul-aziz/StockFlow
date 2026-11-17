import React from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router'

const DashboardLayout = () => {
  return (
    <div className='w-full min-h-screen flex flex-col md:flex-row bg-gray-50'>
      <div className='print:hidden'>
        <Sidebar />
      </div>
      <main className='flex-1 min-w-0'>
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout