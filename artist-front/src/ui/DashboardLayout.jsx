import React from 'react'
import { Outlet } from 'react-router'
import Header from './Header'
import LoadingOverlay from 'react-loading-overlay'
import { useUploadCsvMutation } from '../features/artist/artistApi'


const DashboardLayout = () => {
  const [someFunc, { isLoading }] = useUploadCsvMutation();



  return (
    <LoadingOverlay
      active={isLoading}
      spinner
      text='uploading content...'
    >
      <div className='h-screen'>
        <Header />
        <main className='px-10 sm:px-4 md:px-4 my-4'>
          <Outlet />
        </main>

      </div>
    </LoadingOverlay>

  )
}

export default DashboardLayout
