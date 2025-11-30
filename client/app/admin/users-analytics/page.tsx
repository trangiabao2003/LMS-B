"use client"

import UsersAnalytics from '@/components/admin/analytics/users-analytics'
import DashboardHero from '@/components/admin/dashboard-hero'
import { AdminLayout } from '@/components/admin/layout/admin-layout'
import AdminProtected from '@/hooks/admin-protected'

type Props = {}

const page = (props: Props) => {
    return (
        <AdminProtected>
            <AdminLayout>
                <DashboardHero />
                <UsersAnalytics />
            </AdminLayout>
        </AdminProtected>
    )
}

export default page