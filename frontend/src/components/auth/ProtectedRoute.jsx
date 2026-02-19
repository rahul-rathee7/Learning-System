import React from 'react'
import { Outlet } from 'react-router-dom'

const protectedRoute = () => {
    const isAuthenticated = true
    const loading = false

    if(loading) {
        return (
          <div className='flex items-center justify-center h-screen'>
            <p>Loading...</p>
          </div>
        )
    }

  return isAuthenticated ? (
    <AppLayout>
        <Outlet />
    </AppLayout>
  ) : (
    <Navigate to="/login" replace />
  )
}

export default protectedRoute
