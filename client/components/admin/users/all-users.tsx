import { Button } from '@/components/ui/button';
import { Box } from '@mui/material';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react'
import { useGetAllUsersQuery } from '@/redux/features/user/userApi';
import { AiOutlineDelete } from 'react-icons/ai';
import { MdMailOutline } from "react-icons/md";
import { DataGrid } from "@mui/x-data-grid"
import Loader from '@/components/Loader/Loader';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import { styles } from '@/styles/styles';

TimeAgo.addDefaultLocale(en)

type Props = {
    isTeam: boolean;
}

const AllUsers = ({ isTeam }: Props) => {
    const [active, setActive] = useState(false)
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { isLoading, data, error } = useGetAllUsersQuery({})

    useEffect(() => {
        setMounted(true);
    }, [theme]);

    const currentTheme = mounted ? theme : 'light';
    const isDark = currentTheme === 'dark';
    const timeAgo = new TimeAgo('en-US')

    const columns = [
        { field: "id", headerName: "ID", flex: .3 },
        { field: "name", headerName: "Name", flex: .4 },
        { field: "email", headerName: "Email", flex: .5 },
        { field: "role", headerName: "Role", flex: .3 },
        { field: "courses", headerName: "Purchased Courses", flex: .3 },
        { field: "created_at", headerName: "Joined At", flex: .3 },
        {
            field: " ",
            headerName: "Delete",
            flex: 0.2,
            renderCell: (params: any) => {
                return (
                    <Button
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
                );
            },
        },
        {
            field: "  ",
            headerName: "Send Email",
            flex: 0.2,
            renderCell: (params: any) => {
                return (
                    <a
                        href={`mailto:${params.row.email}`}
                        className={`${isDark
                            ? "bg-slate-600 hover:bg-slate-700"
                            : "bg-gray-200 hover:bg-gray-300"
                            } items-center`}
                    >
                        <MdMailOutline
                            className={isDark ? "text-white" : "text-black"}
                            size={20}
                        />
                    </a>
                );
            },
        },
    ]

    const rows: any = [];

    if (isTeam) {
        const newData = data && data.users.filter((item: any) => item.role === "admin")

        newData &&
            newData.forEach((item: any) => {
                const createdDate = item.createdAt ? new Date(item.createdAt) : new Date();
                rows.push({
                    id: item._id,
                    name: item.name,
                    email: item.email,
                    role: item.role,
                    courses: item.courses.length,
                    created_at: timeAgo.format(createdDate),
                })
            })
    } else {
        data &&
            data.users.forEach((item: any) => {
                const createdDate = item.createdAt ? new Date(item.createdAt) : new Date();
                rows.push({
                    id: item._id,
                    name: item.name,
                    email: item.email,
                    role: item.role,
                    courses: item.courses.length,
                    created_at: timeAgo.format(createdDate),
                })
            })
    }

    // Show loading state while mounting
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
        <div className="mt-[120px]">
            {
                isLoading ? (
                    <Loader />
                ) : (
                    <Box m="20px">
                        <div className="w-full flex justify-end">
                            <button className={`${styles.button} w-[200px]! dark:bg-[#3e4396] dark:border dark:border-[#6bdbcca2]`}
                            onClick={() => setActive(!active)}>
                                Add New Member
                            </button>
                        </div>
                        <Box
                            key={currentTheme}
                            m="40px 0 0 0"
                            height="80vh"
                            sx={{
                                "& .MuiDataGrid-root": {
                                    border: "none",
                                    outline: "none",
                                },
                                // Select dropdown icon
                                "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
                                    color: isDark ? "#fff !important" : "#000 !important",
                                },
                                // Sort icons
                                "& .MuiDataGrid-sortIcon": {
                                    color: isDark ? "#fff !important" : "#000 !important",
                                },
                                // Data rows
                                "& .MuiDataGrid-row": {
                                    color: isDark ? "#fff !important" : "#000 !important",
                                    borderBottom: isDark
                                        ? "1px solid #ffffff30 !important"
                                        : "1px solid #ccc !important",
                                    "&:hover": {
                                        backgroundColor: isDark ? "#2d3748 !important" : "#f5f5f5 !important",
                                    },
                                },
                                // Pagination
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
                                // Cells
                                "& .MuiDataGrid-cell": {
                                    borderBottom: "none !important",
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
                                // Column Headers Container
                                "& .MuiDataGrid-columnHeaders": {
                                    backgroundColor: isDark ? "#3e4396 !important" : "#A4A9FC !important",
                                    borderBottom: "none !important",
                                },
                                // Individual Column Header
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
                                // Column Header Content
                                "& .MuiDataGrid-columnHeaderTitle": {
                                    color: isDark ? "#fff !important" : "#000 !important",
                                    fontWeight: "600 !important",
                                },
                                "& .MuiDataGrid-columnHeaderTitleContainer": {
                                    color: isDark ? "#fff !important" : "#000 !important",
                                },
                                "& .MuiDataGrid-columnHeaderDraggableContainer": {
                                    color: isDark ? "#fff !important" : "#000 !important",
                                },
                                // Virtual Scroller (body area)
                                "& .MuiDataGrid-virtualScroller": {
                                    backgroundColor: isDark ? "#1F2A40 !important" : "#F2F0F0 !important",
                                },
                                // Footer
                                "& .MuiDataGrid-footerContainer": {
                                    color: isDark ? "#fff !important" : "#000 !important",
                                    borderTop: "none !important",
                                    backgroundColor: isDark ? "#3e4396 !important" : "#A4A9FC !important",
                                },
                                // Checkbox
                                "& .MuiCheckbox-root": {
                                    color: isDark ? "#b7ebde !important" : "#000 !important",
                                },
                                "& .MuiCheckbox-root.Mui-checked": {
                                    color: isDark ? "#b7ebde !important" : "#1976d2 !important",
                                },
                                // Icons
                                "& .MuiDataGrid-iconSeparator": {
                                    color: isDark ? "rgba(255,255,255,0.3) !important" : "rgba(0,0,0,0.3) !important",
                                },
                                "& .MuiDataGrid-menuIcon": {
                                    color: isDark ? "#fff !important" : "#000 !important",
                                },
                                "& .MuiDataGrid-menuIconButton": {
                                    color: isDark ? "#fff !important" : "#000 !important",
                                },
                                "& .MuiIconButton-root": {
                                    color: isDark ? "#fff !important" : "#000 !important",
                                },
                                // All SVG icons
                                "& .MuiSvgIcon-root": {
                                    color: isDark ? "#fff !important" : "#000 !important",
                                },
                                // Toolbar (if used)
                                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                                    color: isDark ? "#fff !important" : "#000 !important",
                                },
                                // Filter panel
                                "& .MuiDataGrid-filterForm": {
                                    color: isDark ? "#fff !important" : "#000 !important",
                                },
                                // Column menu
                                "& .MuiDataGrid-columnMenu": {
                                    backgroundColor: isDark ? "#1F2A40 !important" : "#fff !important",
                                },
                                // Overlay (when no rows)
                                "& .MuiDataGrid-overlay": {
                                    backgroundColor: isDark ? "#1F2A40 !important" : "#F2F0F0 !important",
                                },
                            }}
                        >
                            <DataGrid checkboxSelection rows={rows} columns={columns} />
                        </Box>
                    </Box>
                )

            }
        </div>
    )
}

export default AllUsers