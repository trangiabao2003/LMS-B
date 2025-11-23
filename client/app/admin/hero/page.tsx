"use client"

import EditHero from '@/components/admin/customization/edit-hero'
import DashboardHero from '@/components/admin/dashboard-hero'
import { AdminLayout } from '@/components/admin/layout/admin-layout'
import AdminProtected from '@/hooks/admin-protected'

type Props = {}

const page = (props: Props) => {
    return (
        <AdminProtected>
            <AdminLayout>
                <DashboardHero />
                <EditHero />
            </AdminLayout>
        </AdminProtected>
    )
}

export default page