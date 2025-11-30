import UsersAnalytics from '../analytics/users-analytics';
import { MdBorderLeft } from 'react-icons/md';
import { Box, CircularProgress } from '@mui/material';
import { CircleUser } from 'lucide-react';
import OrdersAnalytics from '../analytics/orders-analytics';
import AllInvoices from '../order/all-invoices';

type Props = {
    open?: boolean;
    value?: number;
}

const CircularProgressWithLabel = ({ open, value }: Props) => {
    return (
        <Box sx={{ position: "relative", display: "inline-flex" }}>
            <CircularProgress
                variant="determinate"
                value={value}
                size={45}
                color={value && value > 99 ? "info" : 'error'}
                thickness={4}
                style={{ zIndex: open ? -1 : 1 }}
            />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            ></Box>
        </Box>
    );
};

const DashboardWidgets = ({ open, value }: Props) => {
    return (
        <div className='mt-[30px] min-h-screen bg-gray-50 dark:bg-slate-900 pb-10'>
            {/* Top Section: Users Analytics (3 columns) + Stats Cards (1 column) */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 p-8">
                {/* Users Analytics Chart - 3 columns */}
                <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
                    <UsersAnalytics isDashboard={true} />
                </div>

                {/* Right Column: Sales + New Users Cards stacked */}
                <div className="space-y-6">
                    {/* Sales Stats Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <MdBorderLeft className="dark:text-[#45CBA0] text-black text-[28px] mb-3" />
                                <h5 className="font-Poppins dark:text-white text-black text-[24px] font-semibold">
                                    120
                                </h5>
                                <h5 className="mt-2 font-Poppins dark:text-[#45CBA0] text-black text-[14px] font-normal">
                                    Sales Obtained
                                </h5>
                            </div>
                            <div className="text-right">
                                <CircularProgressWithLabel value={100} open={open} />
                                <h5 className="text-center pt-3 text-sm font-Poppins dark:text-[#45CBA0] text-black">
                                    +120%
                                </h5>
                            </div>
                        </div>
                    </div>

                    {/* New Users Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <CircleUser className="dark:text-[#45CBA0] text-black text-[28px] mb-3" />
                                <h5 className="font-Poppins dark:text-white text-black text-[24px] font-semibold">
                                    450
                                </h5>
                                <h5 className="mt-2 font-Poppins dark:text-[#45CBA0] text-black text-[14px] font-normal">
                                    New Users
                                </h5>
                            </div>
                            <div className="text-right">
                                <CircularProgressWithLabel value={100} open={open} />
                                <h5 className="text-center pt-3 text-sm font-Poppins dark:text-[#45CBA0] text-black">
                                    +150%
                                </h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Orders Analytics + Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-8">
                {/* Orders Analytics - 2 columns */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
                    <OrdersAnalytics isDashboard={true} />
                </div>

                {/* Recent Transactions - 1 column */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
                    <h5 className="dark:text-white text-black text-[20px] font-medium font-Poppins pb-3">
                        Recent Transactions
                    </h5>
                    <div className="border-t dark:border-[#ffffff1c] border-[#00000015]">
                        <AllInvoices isDashboard={true} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardWidgets