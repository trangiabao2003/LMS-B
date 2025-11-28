import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useTheme } from "next-themes";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import Loader from "../../Loader/Loader";
import TimeAgo from 'javascript-time-ago'
import { useGetAllOrdersQuery } from "@/redux/features/orders/ordersApi";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { AiOutlineMail } from "react-icons/ai";
import en from "javascript-time-ago/locale/en";
import { useEffect, useState } from "react";

TimeAgo.addDefaultLocale(en)

type Props = {
    isDashboard?: boolean;
}

const AllInvoices = ({ isDashboard }: Props) => {
    const timeAgo = new TimeAgo('en-US')
    const { theme, setTheme } = useTheme();
    const { isLoading, data } = useGetAllOrdersQuery({});
    const { data: usersData } = useGetAllUsersQuery({});
    const { data: coursesData } = useGetAllCoursesQuery({});
    const [orderData, setOrderData] = useState<any>([]);

    useEffect(() => {
        if (data) {
            const temp = data.orders.map((item: any) => {
                const user = usersData?.users.find(); (user: any) => user._id === item.userId
                const course = coursesData?.courses.find(
                ); (course: any) => course._id === item.courseId
                return {
                    ...item,
                    userName: user?.name,
                    userEmail: user?.email,
                    title: course?.name,
                    price: "$" + course?.price,
                };
            });
            setOrderData(temp);
        }

    }, [data, usersData, coursesData]);

    const columns: any = [
        { field: "id", headerName: "ID", flex: 0.3 },
        { field: "userName", headerName: "Name", flex: isDashboard ? .6 : .5},
        ...(isDashboard
            ? []
            : [
                { field: "userEmail", headerName: "Email", flex: 1 },
                { field: "title", headerName: "Course Title", flex: 1 },
            ]),
        { field: "price", headerName: "Price", flex: 0.5 },
        (isDashboard
            ? [
                { field: "created_at", headerName: "Created At", flex: 0.5 },
            ]
            : [
                {
                    field: " ",
                    headerName: "Email",
                    flex: 0.2,
                    renderCell: (params: any) => {
                        return (
                            <a href={`mailto:${params.row.userEmail}`}>
                                <AiOutlineMail
                                    className="dark:text-white ☐ text-black"
                                    size={20}
                                />
                            </a>
                        );
                    },
                },
            ]),
    ];

    return (
        <div>AllInvoices</div>
    )
}

export default AllInvoices