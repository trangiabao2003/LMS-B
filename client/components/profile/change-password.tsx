"use client"

import { useUpdatePasswordMutation } from '@/redux/features/user/userApi';
import { styles } from './../../styles/styles';
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

type Props = {}

const ChangePassword = (props: Props) => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [updatePassword, { isSuccess, error }] = useUpdatePasswordMutation();
    const passwordChangeHandler = async (e: any) => {
        if (oldPassword === "" || newPassword === "" || confirmPassword === "") {
            toast.error("Please fill all the fields");
            return;
        } else if (newPassword !== confirmPassword) {
            toast.error("New password and confirm password do not match");
            return;
        }
        e.preventDefault();
        await updatePassword({ oldPassword, newPassword });
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success("Password updated successfully!");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }
        if (error) {
            const errorData: any = error;
            toast.error(errorData.data.message);
        }
    }, [isSuccess, error])


    return (
        <div className="w-full pl-7 px-2 md:px-5 md:pl-0">
            <h1 className="block text-[25px] md:text-[30px] font-Poppins text-center font-medium text-black dark:text-white pb-2">
                Change Password
            </h1>
            <div className="w-full flex flex-col items-center mb-12">
                <form
                    aria-required
                    onSubmit={passwordChangeHandler}
                    className="flex flex-col items-center"
                >
                    <div className="w-full md:w-[60%] mt-5">
                        <label className="block text-sm font-semibold text-foreground mb-2">Enter your old password</label>
                        <input
                            type="password"
                            className={`${styles.input} w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-[#37a39a] focus:outline-none focus:ring-2 focus:ring-[#37a39a]/20`}
                            required
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col w-full md:w-[60%] mt-2">
                        <label className="block text-sm font-semibold text-foreground mb-2">Enter your new password</label>
                        <input
                            type="password"
                            className={`${styles.input} w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-[#37a39a] focus:outline-none focus:ring-2 focus:ring-[#37a39a]/20`}
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col w-full md:w-[60%] mt-2">
                        <label className="block text-sm font-semibold text-foreground mb-2">
                            Enter your confirm password
                        </label>
                        <input
                            type="password"
                            className={`${styles.input} w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-[#37a39a] focus:outline-none focus:ring-2 focus:ring-[#37a39a]/20`}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <input
                            className={`w-full py-2.5 mt-8 border-2 border-[#37a39a] text-[#37a39a] dark:text-white font-semibold rounded-lg hover:bg-[#37a39a] hover:text-white transition duration-200`}
                            required
                            value="Update"
                            type="submit"
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ChangePassword