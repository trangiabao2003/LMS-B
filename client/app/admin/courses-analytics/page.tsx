"use client"

import CoursesAnalytics from '@/components/admin/analytics/courses-analytics'
import DashboardHero from '@/components/admin/dashboard-hero'
import { AdminLayout } from '@/components/admin/layout/admin-layout'
import AdminProtected from '@/hooks/admin-protected'

type Props = {}

const page = (props: Props) => {
    return (
        <AdminProtected>
            <AdminLayout>
                <DashboardHero />
                <CoursesAnalytics />
            </AdminLayout>
        </AdminProtected>
    )
}

export default page