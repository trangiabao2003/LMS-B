import { Button } from '@/components/ui/button';
import { Box } from '@mui/material';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react'
import { useDeleteUserMutation, useGetAllUsersQuery, useUpdateUserRoleMutation } from '@/redux/features/user/userApi';
import { AiOutlineDelete } from 'react-icons/ai';
import { MdMailOutline } from "react-icons/md";
import { DataGrid } from "@mui/x-data-grid"
import Loader from '@/components/Loader/Loader';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import { styles } from '@/styles/styles';
import toast from 'react-hot-toast';

TimeAgo.addDefaultLocale(en)

type Props = {
    isTeam?: boolean;
}

const AllUsers = ({ isTeam = false }: Props) => {
    const [active, setActive] = useState(false)
    const [showAddModal, setShowAddModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteUserId, setDeleteUserId] = useState("")
    const [deleteUserName, setDeleteUserName] = useState("")
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("admin");
    const [userId, setUserId] = useState("");
    const [updateUserRole, { error: updateError, isSuccess }] =
        useUpdateUserRoleMutation();
    const { isLoading, data, refetch } = useGetAllUsersQuery({}, { refetchOnMountOrArgChange: true });
    const [deleteUser, { isSuccess: deleteSuccess, error: deleteError }] =
        useDeleteUserMutation();

    useEffect(() => {
        if (updateError) {
            if ("data" in updateError) {
                const errorMessage = updateError as any;
                toast.error(errorMessage.data.message);
            }
        }

        if (isSuccess) {
            refetch();
            toast.success("User role updated successfully");
            setActive(false);
            setShowAddModal(false);
            setEmail("");
            setRole("admin");
        }
        if (deleteSuccess) {
            refetch();
            toast.success("Delete user successfully!")
            setShowDeleteModal(false);
            setDeleteUserId("");
            setDeleteUserName("");
        }
        if (deleteError) {
            if ("data" in deleteError) {
                const errorMessage = deleteError as any;
                toast.error(errorMessage.data.message);
            }
        }
    }, [updateError, isSuccess, deleteSuccess, deleteError, refetch])


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
            field: "delete",
            headerName: "Delete",
            flex: 0.2,
            renderCell: (params: any) => {
                const handleDelete = () => {
                    setDeleteUserId(params.row.id);
                    setDeleteUserName(params.row.name);
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
        {
            field: "edit",
            headerName: "Edit Role",
            flex: 0.2,
            renderCell: (params: any) => {
                const handleEditRole = () => {
                    setUserId(params.row.id);
                    setEmail(params.row.email);
                    setRole(params.row.role);
                    setActive(true);
                };
                return (
                    <div className="flex items-center justify-center w-full h-full">
                        <Button
                            onClick={handleEditRole}
                            className={`${isDark
                                ? "bg-slate-600 hover:bg-slate-700"
                                : "bg-gray-200 hover:bg-gray-300"
                                }`}
                        >
                            <span className={isDark ? "text-white" : "text-black"}>Edit</span>
                        </Button>
                    </div>
                );
            },
        },
        {
            field: "email_action",
            headerName: "Send Email",
            flex: 0.2,
            renderCell: (params: any) => {
                return (
                    <div className="flex items-center justify-center w-full h-full">
                        <a
                            href={`mailto:${params.row.email}`}
                            className={`${isDark
                                ? "bg-slate-600 hover:bg-slate-700"
                                : "bg-gray-200 hover:bg-gray-300"
                                } p-2 rounded flex items-center justify-center`}
                        >
                            <MdMailOutline
                                className={isDark ? "text-white" : "text-black"}
                                size={20}
                            />
                        </a>
                    </div>
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
        <>
            <div className="mt-[120px]">
                {
                    isLoading ? (
                        <Loader />
                    ) : (
                        <Box m="20px">
                            <div className="w-full flex justify-end">
                                {isTeam && (
                                    <button
                                        className={`${styles.button} w-[200px] dark:bg-[#1771C6] dark:border dark:border-[#6bdbcca2]`}
                                        onClick={() => setShowAddModal(true)}
                                    >
                                        Add New Member
                                    </button>
                                )}
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
                                            backgroundColor: isDark ? "#2e4a6b !important" : "#f5f5f5 !important",
                                            cursor: "pointer",
                                        },
                                        "&.Mui-selected": {
                                            backgroundColor: isDark ? "#263B5C !important" : "#e3f2fd !important",
                                            "&:hover": {
                                                backgroundColor: isDark ? "#2e4a6b !important" : "#bbdefb !important",
                                            }
                                        }
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
                                        color: isDark ? "#3e4396 !important" : "#3e4396 !important",
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

            {/* Edit User Role Modal */}
            {active && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className={`${isDark ? "bg-slate-900" : "bg-white"} p-8 rounded-lg w-96`}>
                        <h3 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-black"}`}>
                            Update User Role
                        </h3>
                        <div className="mb-4">
                            <label className={`block text-sm font-medium ${isDark ? "text-white" : "text-black"} mb-2`}>
                                Email: {email}
                            </label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className={`w-full px-3 py-2 rounded border ${isDark ? "bg-slate-800 text-white border-slate-600" : "bg-white text-black border-gray-300"}`}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setActive(false);
                                    setEmail("");
                                    setRole("admin");
                                }}
                                className={`${isDark ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600"} text-white px-4 py-2 rounded w-full`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    if (userId && role) {
                                        await updateUserRole({ id: userId, role });
                                    }
                                }}
                                className={`${styles.button} w-full`}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add New Member Modal - Only shown in Team page */}
            {showAddModal && isTeam && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className={`${isDark ? "bg-slate-900" : "bg-white"} p-8 rounded-lg w-96`}>
                        <h3 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-black"}`}>
                            Add New Member
                        </h3>
                        <div className="mb-4">
                            <label className={`block text-sm font-medium ${isDark ? "text-white" : "text-black"} mb-2`}>
                                Select User
                            </label>
                            <select
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full px-3 py-2 rounded border ${isDark ? "bg-slate-800 text-white border-slate-600" : "bg-white text-black border-gray-300"}`}
                            >
                                <option value="">Choose a user...</option>
                                {data?.users
                                    ?.map((user: any) => (
                                        <option key={user._id} value={user.email}>
                                            {user.name} ({user.email}) - {user.role}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className={`block text-sm font-medium ${isDark ? "text-white" : "text-black"} mb-2`}>
                                Role
                            </label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className={`w-full px-3 py-2 rounded border ${isDark ? "bg-slate-800 text-white border-slate-600" : "bg-white text-black border-gray-300"}`}
                            >
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={async () => {
                                    if (email && role) {
                                        const user = data?.users.find((u: any) => u.email === email);
                                        if (user) {
                                            await updateUserRole({ id: user._id, role });
                                        } else {
                                            toast.error("User not found");
                                        }
                                    } else {
                                        toast.error("Please select user and role");
                                    }
                                }}
                                className={`${styles.button} w-full`}
                            >
                                Submit
                            </button>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setEmail("");
                                    setRole("admin");
                                }}
                                className={`${isDark ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600"} text-white px-4 py-2 rounded w-full`}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className={`${isDark ? "bg-slate-900" : "bg-white"} p-8 rounded-lg w-96`}>
                        <h3 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-black"}`}>
                            Confirm Delete
                        </h3>
                        <p className={`mb-6 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                            Are you sure you want to delete <strong>{deleteUserName}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteUserId("");
                                    setDeleteUserName("");
                                }}
                                className={`${isDark ? "bg-gray-600 hover:bg-gray-700" : "bg-gray-300 hover:bg-gray-400"} text-white px-4 py-2 rounded w-full`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    if (deleteUserId) {
                                        await deleteUser(deleteUserId);
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
    )
}

export default AllUsers