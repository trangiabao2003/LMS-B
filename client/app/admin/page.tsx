"use client"

import AdminSidebar from '@/components/admin/sidebar/admin-sidebar'
import AdminProtected from '@/hooks/admin-protected'
import React from 'react'

const page = () => {
  return (
    <AdminProtected>
      <div className="flex h-screen bg-slate-950">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Top Bar */}
          <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 sticky top-0">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          </div>

          {/* Page Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Stats Cards */}
              <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                <h3 className="text-gray-400 text-sm font-semibold mb-2">Total Users</h3>
                <p className="text-3xl font-bold text-white">1,250</p>
              </div>
              <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                <h3 className="text-gray-400 text-sm font-semibold mb-2">Total Courses</h3>
                <p className="text-3xl font-bold text-white">48</p>
              </div>
              <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                <h3 className="text-gray-400 text-sm font-semibold mb-2">Revenue</h3>
                <p className="text-3xl font-bold text-white">$12,450</p>
              </div>
              <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                <h3 className="text-gray-400 text-sm font-semibold mb-2">Total Orders</h3>
                <p className="text-3xl font-bold text-white">385</p>
              </div>
            </div>

            {/* Placeholder for charts or other content */}
            <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 min-h-96 flex items-center justify-center">
              <p className="text-gray-400">Analytics and charts will go here</p>
            </div>
          </div>
        </div>
      </div>
    </AdminProtected>
  )
}

export default page