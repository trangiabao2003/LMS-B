"use client"

import EditFaq from '@/components/admin/customization/edit-faq'
import DashboardHero from '@/components/admin/dashboard-hero'
import { AdminLayout } from '@/components/admin/layout/admin-layout'
import AdminProtected from '@/hooks/admin-protected'

type Props = {}

const page = (props: Props) => {
    return (
        <AdminProtected>
            <AdminLayout>
                <DashboardHero />
                <EditFaq />
            </AdminLayout>
        </AdminProtected>
    )
}

export default page