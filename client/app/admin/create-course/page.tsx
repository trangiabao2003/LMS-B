"use client"

import CreateCourse from '@/components/admin/course/create-course'
import AdminSidebar from '@/components/admin/sidebar/admin-sidebar'
import AdminProtected from '@/hooks/admin-protected'

const CreateCoursePage = () => {
    return (
        <AdminProtected>
            <div className="flex h-screen bg-slate-950">
                {/* Sidebar */}
                <AdminSidebar />
                
                {/* Main Content */}
                <div className="flex-1 overflow-auto">
                    <CreateCourse />
                </div>
            </div>
        </AdminProtected>
    )
}

export default CreateCoursePage