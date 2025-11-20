"use client"

import DashboardHero from '@/components/admin/dashboard-hero'
import AdminSidebar from '@/components/admin/sidebar/admin-sidebar'
import AdminProtected from '@/hooks/admin-protected'

const page = () => {

  return (
    <AdminProtected>
      <div className="flex h-screen bg-slate-950">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <DashboardHero />
      </div>
    </AdminProtected>
  )
}

export default page