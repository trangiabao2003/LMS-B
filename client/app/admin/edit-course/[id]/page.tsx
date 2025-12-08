"use client"

import AdminProtected from '@/hooks/admin-protected'
import { AdminLayout } from '@/components/admin/layout/admin-layout'
import EditCourse from '@/components/admin/course/edit-course'
import { use } from 'react'

type PageProps = {
    params: Promise<{ id: string }>
}

const Page = ({ params }: PageProps) => {
    const { id } = use(params);
    
    return (
        <AdminProtected>
            <AdminLayout>
                <EditCourse id={id} />
            </AdminLayout>
        </AdminProtected>
    )
}

export default Page