import { Button } from '@/components/ui/button';
import { Box } from '@mui/material';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react'
import { useDeleteCourseMutation, useGetAllCoursesQuery } from '@/redux/features/courses/coursesApi';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { DataGrid } from "@mui/x-data-grid"
import Loader from '@/components/Loader/Loader';
import { styles } from '@/styles/styles';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'

TimeAgo.addDefaultLocale(en)

type Props = {}

const AllCourses = (props: Props) => {
    const router = useRouter();
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteCourseId, setDeleteCourseId] = useState("");
    const [deleteCourseName, setDeleteCourseName] = useState("");
    const timeAgo = new TimeAgo('en-US');
    
    const { isLoading, data, refetch } = useGetAllCoursesQuery({}, { refetchOnMountOrArgChange: true });
    const [deleteCourse, { isSuccess: deleteSuccess, error: deleteError }] = useDeleteCourseMutation();

    useEffect(() => {
        if (deleteSuccess) {
            refetch();
            toast.success("Course deleted successfully!");
            setShowDeleteModal(false);
            setDeleteCourseId("");
            setDeleteCourseName("");
        }
        if (deleteError) {
            if ("data" in deleteError) {
                const errorMessage = deleteError as any;
                toast.error(errorMessage.data.message);
            }
        }
    }, [deleteSuccess, deleteError, refetch]);

    useEffect(() => {
        setMounted(true);
    }, [theme]);

    const currentTheme = mounted ? theme : 'light';
    const isDark = currentTheme === 'dark';

    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "title", headerName: "Course Title", flex: 1 },
        { field: "ratings", headerName: "Ratings", flex: 0.5 },
        { field: "purchased", headerName: "Purchased", flex: 0.5 },
        { field: "created_at", headerName: "Created At", flex: 0.5 },
        {
            field: "edit",
            headerName: "Edit",
            flex: 0.2,
            renderCell: (params: any) => {
                return (
                    <div className="flex items-center justify-center w-full h-full">
                        <Button
                            onClick={() => router.push(`/admin/edit-course/${params.row.id}`)}
                            className={`${isDark
                                ? "bg-slate-600 hover:bg-slate-700"
                                : "bg-gray-200 hover:bg-gray-300"
                                }`}
                        >
                            <AiOutlineEdit
                                className={isDark ? "text-white" : "text-black"}
                                size={20}
                            />
                        </Button>
                    </div>
                );
            },
        },
        {
            field: "delete",
            headerName: "Delete",
            flex: 0.2,
            renderCell: (params: any) => {
                const handleDelete = () => {
                    setDeleteCourseId(params.row.id);
                    setDeleteCourseName(params.row.title);
                    setShowDeleteModal(true);
                };
                return (
                    <div className="flex items-center justify-center w-full h-full">
                        <Button
                            onClick={handleDelete}
                            className={`${isDark
                                ? "bg-slate-600 hover:bg-slate-700"
                                : "bg-gray-200 hover:bg-gray-300"
                                }`}
                        >
                            <AiOutlineDelete
                                className={isDark ? "text-white" : "text-black"}
                                size={20}
                            />
                        </Button>
                    </div>
                );
            },
        },
    ];

    const rows: any = [];

    if (data && data.courses) {
        data.courses.forEach((item: any) => {
            rows.push({
                id: item._id,
                title: item.name,
                ratings: item.rating,
                purchased: item.purchased || 0,
                created_at: item.createdAt ? timeAgo.format(new Date(item.createdAt)) : 'N/A',
            });
        });
    }

    if (!mounted) {
        return (
            <div className="mt-[120px]">
                <Box m="20px">
                    <div className="flex items-center justify-center h-[80vh]">
                        <p className="text-gray-500">Loading...</p>
                    </div>
                </Box>
            </div>
        );
    }

    return (
        <>
            <div className="mt-[120px]">
                {isLoading ? (
                    <Loader />
                ) : (
                    <Box m="20px">
                        <Box
                            key={currentTheme}
                            m="40px 0 0 0"
                            height="80vh"
                            sx={{
                                "& .MuiDataGrid-root": {
                                    border: "none",
                                    outline: "none",
                                },
                                "& .MuiDataGrid-cell": {
                                    borderBottom: "none !important",
                                    color: isDark ? "#fff !important" : "#000 !important",
                                    display: "flex !important",
                                    alignItems: "center !important",
                                },
                                "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
                                    color: isDark ? "#fff !important" : "#000 !important",
                                },
                                "& .MuiDataGrid-sortIcon": {
                                    color: isDark ? "#fff !important" : "#000 !important",
                                },
                                "& .MuiDataGrid-row": {
                                    color: isDark ? "#fff !important" : "#000 !important",
                                    borderBottom: isDark
                                        ? "1px solid #ffffff30 !important"
                                        : "1px solid #ccc !important",
                                    "&:hover": {
                                        backgroundColor: isDark ? "#2d3748 !important" : "#f5f5f5 !important",
                                    },
                                },
                                "& .MuiTablePagination-root": {
                                    color: isDark ? "#fff !important" : "#000 !important",
                                },
                                "& .MuiTablePagination-selectIcon": {
                                    color: isDark ? "#fff !important" : "#000 !important",
                                },
                                "& .MuiTablePagination-displayedRows": {
                                    color: isDark ? "#fff !important" : "#000 !important",
                                },
                                "& .MuiTablePagination-actions": {
                                    color: isDark ? "#fff !important" : "#000 !important",
                                },
                                "& .MuiDataGrid-cell:focus": {
                                    outline: "none !important",
                                },
                                "& .MuiDataGrid-cell:focus-within": {
                                    outline: "none !important",
                                },
                                "& .name-column--cell": {
                                    color: isDark ? "#fff !important" : "#000 !important",
                                },
                                "& .MuiDataGrid-columnHeaders": {
                                    backgroundColor: isDark ? "#3e4396 !important" : "#A4A9FC !important",
                                    borderBottom: "none !important",
                                },
                                "& .MuiDataGrid-columnHeader": {
                                    backgroundColor: isDark ? "#3e4396 !important" : "#A4A9FC !important",
                                    color: isDark ? "#fff !important" : "#000 !important",
                                    outline: "none !important",
                                    "&:focus": {
                                        outline: "none !important",
                                    },
                                    "&:focus-within": {
                                        outline: "none !important",
                                    },
                                },
                                "& .MuiDataGrid-columnHeaderTitle": {
                                    color: isDark ? "#fff !important" : "#000 !important",
                                    fontWeight: "600 !important",
                                },
                                "& .MuiDataGrid-virtualScroller": {
                                    backgroundColor: isDark ? "#1F2A40 !important" : "#F2F0F0 !important",
                                },
                                "& .MuiDataGrid-footerContainer": {
                                    color: isDark ? "#fff !important" : "#000 !important",
                                    borderTop: "none !important",
                                    backgroundColor: isDark ? "#3e4396 !important" : "#A4A9FC !important",
                                },
                                "& .MuiCheckbox-root": {
                                    color: isDark ? "#b7ebde !important" : "#000 !important",
                                },
                                "& .MuiCheckbox-root.Mui-checked": {
                                    color: isDark ? "#70d8bd !important" : "#3e4396 !important",
                                },
                                "& .MuiDataGrid-row.Mui-selected": {
                                    backgroundColor: isDark ? "#374151 !important" : "#e5e7eb !important",
                                    "&:hover": {
                                        backgroundColor: isDark ? "#4b5563 !important" : "#d1d5db !important",
                                    },
                                },
                                "& .MuiDataGrid-row.Mui-selected .MuiDataGrid-cell": {
                                    color: isDark ? "#fff !important" : "#000 !important",
                                },
                                "& .MuiDataGrid-iconSeparator": {
                                    color: isDark ? "rgba(255,255,255,0.3) !important" : "rgba(0,0,0,0.3) !important",
                                },
                                "& .MuiSvgIcon-root": {
                                    color: isDark ? "#fff !important" : "#000 !important",
                                },
                            }}
                        >
                            <DataGrid checkboxSelection rows={rows} columns={columns} />
                        </Box>
                    </Box>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className={`${isDark ? "bg-slate-900" : "bg-white"} p-8 rounded-lg w-96`}>
                        <h3 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-black"}`}>
                            Confirm Delete
                        </h3>
                        <p className={`mb-6 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                            Are you sure you want to delete <strong>{deleteCourseName}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteCourseId("");
                                    setDeleteCourseName("");
                                }}
                                className={`${isDark ? "bg-gray-600 hover:bg-gray-700" : "bg-gray-300 hover:bg-gray-400"} text-white px-4 py-2 rounded w-full`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    if (deleteCourseId) {
                                        await deleteCourse(deleteCourseId);
                                    }
                                }}
                                className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded w-full`}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AllCourses;