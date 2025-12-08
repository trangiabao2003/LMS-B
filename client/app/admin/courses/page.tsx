"use client"

import AllCourses from '@/components/admin/course/all-courses'
import DashboardHero from '@/components/admin/dashboard-hero'
import { AdminLayout } from '@/components/admin/layout/admin-layout'
import AdminProtected from '@/hooks/admin-protected'
import React from 'react'

type Props = {}

const page = (props: Props) => {
    return (
        <AdminProtected>
            <AdminLayout>
                <DashboardHero />
                <AllCourses />
            </AdminLayout>
        </AdminProtected>
    )
}

export default page