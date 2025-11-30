"use client"

import DashboardHero from '@/components/admin/dashboard-hero'
import DashboardWidgets from '@/components/admin/widgets/dashboard-widgets'
import AdminProtected from '@/hooks/admin-protected'
import { AdminLayout } from '@/components/admin/layout/admin-layout'
import { Heading } from '../utils/Heading'

const AdminPage = () => {

  return (
    <AdminProtected>
      <AdminLayout>
        <Heading
          title="Admin Page - LMSB"
        />
        <DashboardHero isDashboard={true} />
        <DashboardWidgets />
      </AdminLayout>
    </AdminProtected>
  )
}

export default AdminPage