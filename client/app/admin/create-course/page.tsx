"use client"

import CreateCourse from '@/components/admin/course/create-course'
import AdminProtected from '@/hooks/admin-protected'
import { AdminLayout } from '@/components/admin/layout/admin-layout'

const CreateCoursePage = () => {
    return (
        <AdminProtected>
            <AdminLayout>
                <CreateCourse />
            </AdminLayout>
        </AdminProtected>
    )
}

export default CreateCoursePage