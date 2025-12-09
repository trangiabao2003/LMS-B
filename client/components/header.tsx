"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { LoginModal } from "@/components/auth/login-modal"
import { VerificationModal } from "./auth/verification-modal"
import { SignupModal } from "./auth/signup-modal"
import { signOut } from "next-auth/react";
import { CustomModal } from "@/app/utils/CustomModal"
import { useSelector } from "react-redux"
import Image from "next/image"
import avatar from "./../public/avatar.jpg"
import Link from "next/link"
import { useLogOutQuery, useSocialAuthMutation } from "@/redux/features/auth/authApi"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import { ThemeSwhitcher } from "@/app/utils/ThemeSwitcher"
import { useLoadUserQuery } from "@/redux/features/api/apiSlice"

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
}

export function Header({ open, setOpen, activeItem, route, setRoute }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [signupModalOpen, setSignupModalOpen] = useState(false)
  const [verificationModalOpen, setVerificationModalOpen] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const { data: userData, isLoading, refetch } = useLoadUserQuery(undefined, {})
  const { user } = useSelector((state: any) => state.auth);
  const { data } = useSession();
  const [socialAuth, { isSuccess, error }] = useSocialAuthMutation()
  const [logout, setLogout] = useState(false);
  const { } = useLogOutQuery(undefined,
    { skip: !logout ? true : false });

  const logOutHandler = async () => {
    setLogout(true);
    await signOut();
  }

  useEffect(() => {
    if (!isLoading) {
      if (!userData) {
        if (data) {
          socialAuth({
            email: data?.user?.email,
            name: data?.user?.name,
            avatar: data.user?.image
          });
          refetch();
        }
      }
      if (data === null) {
        if (isSuccess) {
          toast.success("Login successful")
        }
      }
      if (data === null && !userData && !isLoading) {
        setLogout(true);
      }
    }
  }, [data, userData, isLoading]);

  const handleOpenLogin = () => {
    setSignupModalOpen(false)
    setVerificationModalOpen(false)
    setLoginModalOpen(true)
  }

  const handleOpenSignup = () => {
    setLoginModalOpen(false)
    setVerificationModalOpen(false)
    setSignupModalOpen(true)
  }

  const handleSignupSuccess = (email?: string) => {
    setSignupModalOpen(false)
    setUserEmail(email || "your@email.com")
    setVerificationModalOpen(true)
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              L
            </div>
            <span className="text-xl font-bold text-foreground">LearnHub</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className={`text-sm font-medium transition-colors ${activeItem === 0 ? "text-primary font-semibold" : "text-foreground hover:text-primary"
              }`}>
              Home
            </a>
            <a href="/courses" className={`text-sm font-medium transition-colors ${activeItem === 1 ? "text-primary font-semibold" : "text-foreground hover:text-primary"
              }`}>
              Courses
            </a>
            <a href="/about" className={`text-sm font-medium transition-colors ${activeItem === 2 ? "text-primary font-semibold" : "text-foreground hover:text-primary"
              }`}>
              About
            </a>
            <a href="/policies" className={`text-sm font-medium transition-colors ${activeItem === 3 ? "text-primary font-semibold" : "text-foreground hover:text-primary"
              }`}>
              Policies
            </a>
            <a href="/faq" className={`text-sm font-medium transition-colors ${activeItem === 4 ? "text-primary font-semibold" : "text-foreground hover:text-primary"
              }`}>
              FAQ
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <ThemeSwhitcher />

            {
              userData ? (
                <div className="relative">
                  <Image
                    src={userData.user.avatar ? userData.user.avatar.url : avatar}
                    alt="Avatar"
                    width={30}
                    height={30}
                    className="w-[30px] h-[30px] rounded-full cursor-pointer object-cover"
                    style={{ border: activeItem === 5 ? "2px solid #37a39a" : "none" }}
                    onClick={() => setIsOpen(!isOpen)}
                  />

                  {/* Dropdown Menu */}
                  {isOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => logOutHandler()}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Button variant="ghost" onClick={handleOpenLogin}>
                    Sign In
                  </Button>
                  <Button onClick={handleOpenSignup}>Sign Up</Button>
                </>
              )}

          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden mt-4 flex flex-col gap-4 border-t border-border pt-4">
            <a href="/" className={`text-sm font-medium transition-colors ${activeItem === 0 ? "text-primary font-semibold" : "text-foreground hover:text-primary"
              }`}>
              Home
            </a>
            <a href="/courses" className={`text-sm font-medium transition-colors ${activeItem === 1 ? "text-primary font-semibold" : "text-foreground hover:text-primary"
              }`}>
              Courses
            </a>
            <a href="/about" className={`text-sm font-medium transition-colors ${activeItem === 2 ? "text-primary font-semibold" : "text-foreground hover:text-primary"
              }`}>
              About
            </a>
            <a href="/policies" className={`text-sm font-medium transition-colors ${activeItem === 3 ? "text-primary font-semibold" : "text-foreground hover:text-primary"
              }`}>
              Policies
            </a>
            <a href="/faq" className={`text-sm font-medium transition-colors ${activeItem === 4 ? "text-primary font-semibold" : "text-foreground hover:text-primary"
              }`}>
              FAQ
            </a>
            {!userData && (
              <div className="flex flex-col gap-2 border-t border-border pt-4">
                <Button variant="ghost" className="w-full" onClick={handleOpenLogin}>
                  Sign In
                </Button>
                <Button className="w-full" onClick={handleOpenSignup}>
                  Sign Up
                </Button>
              </div>
            )}
            {userData && (
              <div className="flex flex-col gap-2 border-t border-border pt-4">
                <Link href="/profile">
                  <Button variant="ghost" className="w-full">
                    Profile
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full text-red-600 dark:text-red-400"
                  onClick={() => {
                    setLogout(true);
                    setIsOpen(false);
                  }}
                >
                  Logout
                </Button>
              </div>
            )}
          </nav>
        )}
      </div>

      </header>

      {
        route === "Login" &&
        (
          <>
            {
              open && (
                <CustomModal
                  open={open}
                  setOpen={setOpen}
                  activeItem={activeItem}
                  setRoute={setRoute}
                  component={LoginModal}
                  refetch={refetch}
                />
              )
            }
          </>
        )
      }

      {
        route === "Signup" &&
        (
          <>
            {
              open && (
                <CustomModal
                  open={open}
                  setOpen={setOpen}
                  activeItem={activeItem}
                  setRoute={setRoute}
                  component={SignupModal}
                />
              )
            }
          </>
        )
      }

      {
        route === "Verification" &&
        (
          <>
            {
              open && (
                <CustomModal
                  open={open}
                  setOpen={setOpen}
                  activeItem={activeItem}
                  setRoute={setRoute}
                  component={VerificationModal}
                />
              )
            }
          </>
        )
      }

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSwitchToSignup={handleOpenSignup}
        setOpen={setOpen}
        setRoute={setRoute}
        refetch={refetch}
      />
      <SignupModal
        isOpen={signupModalOpen}
        onClose={() => setSignupModalOpen(false)}
        onSwitchToLogin={handleOpenLogin}
        onSignupSuccess={(email?: string) => handleSignupSuccess(email)}
        setRoute={setRoute}
      />
      <VerificationModal
        isOpen={verificationModalOpen}
        onClose={() => setVerificationModalOpen(false)}
        email={userEmail}
        setRoute={setRoute}
      />
    </>
  )
}
