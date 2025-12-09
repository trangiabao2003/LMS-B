"use client"

import EditCategories from '@/components/admin/customization/edit-categories'
import DashboardHero from '@/components/admin/dashboard-hero'
import { AdminLayout } from '@/components/admin/layout/admin-layout'
import AdminProtected from '@/hooks/admin-protected'

type Props = {}

const page = (props: Props) => {
    return (
        <AdminProtected>
            <AdminLayout>
                <DashboardHero />
                <EditCategories />
            </AdminLayout>
        </AdminProtected>
    )
}

export default page