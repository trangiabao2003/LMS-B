"use client";

import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import Loader from "../../Loader/Loader";
import { useGetAllOrdersQuery } from "@/redux/features/orders/ordersApi";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { AiOutlineMail } from "react-icons/ai";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	ArrowUpDown,
	Search,
} from "lucide-react";

type Props = {
	isDashboard?: boolean;
};

type SortField =
	| "id"
	| "userName"
	| "userEmail"
	| "title"
	| "price"
	| "created_at";
type SortOrder = "asc" | "desc";

const AllInvoices = ({ isDashboard }: Props) => {
	const { isLoading, data } = useGetAllOrdersQuery({});
	const { data: usersData } = useGetAllUsersQuery({});
	const { data: coursesData } = useGetAllCoursesQuery({});
	const [orderData, setOrderData] = useState<any[]>([]);
	const [filteredData, setFilteredData] = useState<any[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(0);
	const [pageSize, setPageSize] = useState(isDashboard ? 5 : 10);
	const [sortField, setSortField] = useState<SortField>("created_at");
	const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
	const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

	useEffect(() => {
		if (data) {
			const temp = data.orders.map((item: any) => {
				const user = usersData?.users.find(
					(user: any) => user._id === item.userId
				);
				const course = coursesData?.courses.find(
					(course: any) => course._id === item.courseId
				);
				return {
					id: item._id,
					userName: user?.name || "N/A",
					userEmail: user?.email || "N/A",
					title: course?.name || "N/A",
					price: "$" + (course?.price || "0"),
					created_at: format(new Date(item.createdAt), "dd/MM/yyyy HH:mm"),
					createdAtRaw: new Date(item.createdAt),
				};
			});
			setOrderData(temp);
			setFilteredData(temp);
		}
	}, [data, usersData, coursesData]);

	// Sorting
	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortOrder("asc");
		}
	};

	const sortedData = [...filteredData].sort((a, b) => {
		let aValue = a[sortField];
		let bValue = b[sortField];

		// Handle date sorting
		if (sortField === "created_at") {
			aValue = a.createdAtRaw;
			bValue = b.createdAtRaw;
		}

		// Handle price sorting
		if (sortField === "price") {
			aValue = parseFloat(aValue.replace("$", ""));
			bValue = parseFloat(bValue.replace("$", ""));
		}

		if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
		if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
		return 0;
	});

	// Pagination
	const totalPages = Math.ceil(sortedData.length / pageSize);
	const paginatedData = sortedData.slice(
		currentPage * pageSize,
		(currentPage + 1) * pageSize
	);

	// Row selection
	const toggleRowSelection = (id: string) => {
		const newSelected = new Set(selectedRows);
		if (newSelected.has(id)) {
			newSelected.delete(id);
		} else {
			newSelected.add(id);
		}
		setSelectedRows(newSelected);
	};

	const toggleAllRows = () => {
		if (selectedRows.size === paginatedData.length) {
			setSelectedRows(new Set());
		} else {
			setSelectedRows(new Set(paginatedData.map((row) => row.id)));
		}
	};

	if (isLoading) {
		return <Loader />;
	}

	return (
		<div className={!isDashboard ? "mt-[120px]" : "mt-0"}>
			<div className={isDashboard ? "" : "mx-10 my-10"}>
				{/* Table */}
				<div
					className="overflow-hidden rounded-lg border border-gray-200 dark:border-slate-700"
					style={{ height: isDashboard ? "35vh" : "auto" }}>
					<div
						className={
							isDashboard ? "overflow-y-auto h-full" : "overflow-x-auto"
						}>
						<table className="w-full">
							{/* Header */}
							<thead className="bg-[#A4A9FC] dark:bg-[#3e4396] sticky top-0 z-10">
								<tr>
									{!isDashboard && (
										<th className="px-4 py-3 text-left">
											<input
												type="checkbox"
												checked={
													selectedRows.size === paginatedData.length &&
													paginatedData.length > 0
												}
												onChange={toggleAllRows}
												className="w-4 h-4 rounded border-white/50 bg-transparent checked:bg-white checked:border-white focus:ring-2 focus:ring-white/50"
											/>
										</th>
									)}
									<th className="px-4 py-3 text-left">
										<button
											onClick={() => handleSort("id")}
											className="flex items-center gap-1 text-white font-semibold hover:text-white/80 transition-colors">
											ID
											<ArrowUpDown className="h-4 w-4" />
										</button>
									</th>
									<th className="px-4 py-3 text-left">
										<button
											onClick={() => handleSort("userName")}
											className="flex items-center gap-1 text-white font-semibold hover:text-white/80 transition-colors">
											Name
											<ArrowUpDown className="h-4 w-4" />
										</button>
									</th>
									{isDashboard ? (
										<th className="px-4 py-3 text-left">
											<button
												onClick={() => handleSort("created_at")}
												className="flex items-center gap-1 text-white font-semibold hover:text-white/80 transition-colors">
												Created At
												<ArrowUpDown className="h-4 w-4" />
											</button>
										</th>
									) : (
										<>
											<th className="px-4 py-3 text-left">
												<button
													onClick={() => handleSort("userEmail")}
													className="flex items-center gap-1 text-white font-semibold hover:text-white/80 transition-colors">
													Email
													<ArrowUpDown className="h-4 w-4" />
												</button>
											</th>
											<th className="px-4 py-3 text-left">
												<button
													onClick={() => handleSort("title")}
													className="flex items-center gap-1 text-white font-semibold hover:text-white/80 transition-colors">
													Course Title
													<ArrowUpDown className="h-4 w-4" />
												</button>
											</th>
										</>
									)}
									<th className="px-4 py-3 text-left">
										<button
											onClick={() => handleSort("price")}
											className="flex items-center gap-1 text-white font-semibold hover:text-white/80 transition-colors">
											Price
											<ArrowUpDown className="h-4 w-4" />
										</button>
									</th>
									{!isDashboard && (
										<th className="px-4 py-3 text-center text-white font-semibold">
											Email
										</th>
									)}
								</tr>
							</thead>

							{/* Body */}
							<tbody className="bg-[#F2F0F0] dark:bg-[#1F2A40]">
								{paginatedData.length === 0 ? (
									<tr>
										<td
											colSpan={isDashboard ? 4 : 7}
											className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
											No data found
										</td>
									</tr>
								) : (
									paginatedData.map((row) => (
										<tr
											key={row.id}
											className={`border-b border-gray-200 dark:border-slate-600/50 hover:bg-gray-100 dark:hover:bg-[#2a3f5f] transition-colors cursor-pointer ${
												selectedRows.has(row.id)
													? "bg-blue-50 dark:bg-[#263B5C]"
													: ""
											}`}>
											{!isDashboard && (
												<td className="px-4 py-3">
													<input
														type="checkbox"
														checked={selectedRows.has(row.id)}
														onChange={() => toggleRowSelection(row.id)}
														className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
													/>
												</td>
											)}
											<td className="px-4 py-3 text-sm text-gray-900 dark:text-white truncate max-w-[100px]">
												{row.id}
											</td>
											<td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
												{row.userName}
											</td>
											{isDashboard ? (
												<td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
													{row.created_at}
												</td>
											) : (
												<>
													<td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
														{row.userEmail}
													</td>
													<td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
														{row.title}
													</td>
												</>
											)}
											<td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
												{row.price}
											</td>
											{!isDashboard && (
												<td className="px-4 py-3 text-center">
													<a
														href={`mailto:${row.userEmail}`}
														className="inline-flex items-center justify-center hover:opacity-70 transition-opacity">
														<AiOutlineMail
															className="text-gray-900 dark:text-white"
															size={20}
														/>
													</a>
												</td>
											)}
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>

				{/* Pagination */}
				<div className="mt-4 flex items-center justify-between px-2">
					<div className="flex items-center gap-2">
						<span className="text-sm text-gray-700 dark:text-gray-300">
							Rows per page:
						</span>
						<select
							value={pageSize}
							onChange={(e) => {
								setPageSize(Number(e.target.value));
								setCurrentPage(0);
							}}
							className="px-3 py-1 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
							{(isDashboard ? [5, 10] : [10, 25, 50, 100]).map((size) => (
								<option key={size} value={size}>
									{size}
								</option>
							))}
						</select>
					</div>

					<div className="flex items-center gap-2">
						<span className="text-sm text-gray-700 dark:text-gray-300">
							{currentPage * pageSize + 1}–
							{Math.min((currentPage + 1) * pageSize, sortedData.length)} of{" "}
							{sortedData.length}
						</span>
					</div>

					<div className="flex items-center gap-1">
						<button
							onClick={() => setCurrentPage(0)}
							disabled={currentPage === 0}
							className="p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							title="First page">
							<ChevronsLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
						</button>
						<button
							onClick={() => setCurrentPage(currentPage - 1)}
							disabled={currentPage === 0}
							className="p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							title="Previous page">
							<ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
						</button>
						<button
							onClick={() => setCurrentPage(currentPage + 1)}
							disabled={currentPage >= totalPages - 1}
							className="p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							title="Next page">
							<ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-300" />
						</button>
						<button
							onClick={() => setCurrentPage(totalPages - 1)}
							disabled={currentPage >= totalPages - 1}
							className="p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							title="Last page">
							<ChevronsRight className="h-5 w-5 text-gray-700 dark:text-gray-300" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AllInvoices;
