"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import avatarIcon from "../../public/avatar.jpg"
import { useEditProfileMutation, useUpdateAvatarMutation } from "@/redux/features/user/userApi";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import toast from "react-hot-toast";

type Props = {
    avatar: string | null;
    user: any;
};

const ProfileInfo = ({ avatar, user }: Props) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [updateAvatar, { isSuccess, error, isLoading }] = useUpdateAvatarMutation();
    const [editProfile, { isSuccess: isEditSuccess, error: editError}] = useEditProfileMutation();


    const { refetch } = useLoadUserQuery(undefined);

    // Update local state when user prop changes
    useEffect(() => {
        if (user) {
            setName(user.name || "")
            setEmail(user.email || "")
        }
    }, [user])

    const imageHandler = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            toast.error('Please select a valid image file (PNG, JPG, JPEG, or WebP)');
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            toast.error('File size must be less than 5MB');
            return;
        }

        try {
            const reader = new FileReader();
            reader.onload = async () => {
                if (reader.readyState === 2) {
                    const base64 = reader.result as string;
                    await updateAvatar({ avatar: base64 });
                }
            };
            reader.onerror = () => {
                console.error("File read error");
                toast.error('Error reading file');
            };
            reader.readAsDataURL(file);
        } catch (err) {
            console.error("Avatar upload error:", err);
            toast.error('Error uploading avatar');
        }
    };

    useEffect(() => {
        if (isSuccess || isEditSuccess) {
            toast.success("Profile updated successfully!");
            refetch();
        }
        if (error || editError) {
            console.error("Upload error:", error || editError);
            toast.error("Failed to update profile.");
        }
    }, [isSuccess, isEditSuccess, error, editError, refetch]);


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (name !== "") {
            await editProfile({ name: name });
        }
    };

    return (
        <>
            <div className="w-full">
                {/* Avatar Section */}
                <div className="flex flex-col items-center mb-12">
                    <div className="relative mb-4">
                        <Image
                            src={user?.avatar?.url || avatar || avatarIcon}
                            alt="avatar"
                            width={130}
                            height={130}
                            className="w-[130px] h-[130px] cursor-pointer border-4 border-[#37a39a] rounded-full object-cover"
                        />
                        <input
                            type="file"
                            name="avatar"
                            id="avatar"
                            className="hidden"
                            onChange={imageHandler}
                            accept="image/png,image/jpg,image/jpeg,image/webp"
                            disabled={isLoading}
                        />
                        <label htmlFor="avatar" className="cursor-pointer">
                            <div className="w-10 h-10 bg-[#37a39a] rounded-full absolute bottom-0 right-0 flex items-center justify-center hover:bg-[#2a8b82] transition">
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <AiOutlineCamera size={22} className="text-white" />
                                )}
                            </div>
                        </label>
                    </div>
                    <p className="text-sm text-muted-foreground">Click camera to update avatar</p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
                    {/* Full Name Field */}
                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-[#37a39a] focus:outline-none focus:ring-2 focus:ring-[#37a39a]/20"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                        />
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
                        <input
                            type="email"
                            readOnly
                            className="w-full px-4 py-2.5 rounded-lg border border-input bg-muted text-foreground cursor-not-allowed opacity-75"
                            value={email}
                            placeholder="your@email.com"
                        />
                        <p className="text-xs text-muted-foreground mt-1.5">Email cannot be changed</p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-2.5 mt-8 border-2 border-[#37a39a] text-[#37a39a] dark:text-white font-semibold rounded-lg hover:bg-[#37a39a] hover:text-white transition duration-200"
                    >
                        Update Profile
                    </button>
                </form>
            </div>
        </>
    )
}

export default ProfileInfo