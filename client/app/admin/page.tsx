"use client"

import DashboardHero from '@/components/admin/dashboard-hero'
import AdminProtected from '@/hooks/admin-protected'
import { AdminLayout } from '@/components/admin/layout/admin-layout'

const AdminPage = () => {

  return (
    <AdminProtected>
      <AdminLayout>
        <DashboardHero />
      </AdminLayout>
    </AdminProtected>
  )
}

export default AdminPage