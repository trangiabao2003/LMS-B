"use client"

import AllUsers from '@/components/admin/users/all-users'
import DashboardHero from '@/components/admin/dashboard-hero'
import { AdminLayout } from '@/components/admin/layout/admin-layout'
import AdminProtected from '@/hooks/admin-protected'

type Props = {}

const page = (props: Props) => {
    return (
        <AdminProtected>
            <AdminLayout>
                <DashboardHero />
                <AllUsers />
            </AdminLayout>
        </AdminProtected>
    )
}

export default page