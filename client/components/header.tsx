"use client"

import { useEffect, useState } from "react"
import { Moon, Sun, Menu, X } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { LoginModal } from "@/components/auth/login-modal"
import { VerificationModal } from "./auth/verification-modal"
import { SignupModal } from "./auth/signup-modal"

import { CustomModal } from "@/app/utils/CustomModal"
import { useSelector } from "react-redux"
import Image from "next/image"
import avatar from "./../public/avatar.jpg"
import Link from "next/link"
import { useLogOutQuery, useSocialAuthMutation } from "@/redux/features/auth/authApi"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import { ThemeSwhitcher } from "@/app/utils/ThemeSwitcher"

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
}

export function Header({ open, setOpen, activeItem, route, setRoute }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [signupModalOpen, setSignupModalOpen] = useState(false)
  const [verificationModalOpen, setVerificationModalOpen] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const { user } = useSelector((state: any) => state.auth);
  const { data } = useSession();
  const [socialAuth, { isSuccess, error }] = useSocialAuthMutation()
  const [logout, setLogout] = useState(false);
  const { } = useLogOutQuery(undefined,
    { skip: !logout ? true : false });

  useEffect(() => {
    if (!user) {
      if (data) {
        socialAuth({
          email: data?.user?.email,
          name: data?.user?.name,
          avatar: data.user?.image
        })
      }
    }
    if (data === null) {
      if (isSuccess) {
        toast.success("Login successful")
      }
    }
    if (data === null) {
      setLogout(true);
    }
  }, [data, user]);

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
            <a href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Home
            </a>
            <a href="/courses" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Courses
            </a>
            <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Categories
            </a>
            <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              About
            </a>
            <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Contact
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
           <ThemeSwhitcher />

            {
              user ? (
                <Link href={"/profile"} >
                  <Image
                    src={user.avatar ? user.avatar.url : avatar}
                    alt="Avatar"
                    width={30}
                    height={30}
                    className="w-[30px] h-[30px] rounded-full cursor-pointer object-cover"
                    style={{border: activeItem === 5 ? "2px solid #37a39a" : "none"}}
                  />
                </Link>
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
            <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Courses
            </a>
            <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Categories
            </a>
            <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              About
            </a>
            <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Contact
            </a>
            <div className="flex flex-col gap-2 border-t border-border pt-4">
              <Button variant="ghost" className="w-full" onClick={handleOpenLogin}>
                Sign In
              </Button>
              <Button className="w-full" onClick={handleOpenSignup}>
                Sign Up
              </Button>
            </div>
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
