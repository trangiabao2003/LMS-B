"use client"

import { useState } from "react"
import { Moon, Sun, Menu, X } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { LoginModal } from "@/components/auth/login-modal"
import { VerificationModal } from "./auth/verification-modal"
import { SignupModal } from "./auth/signup-modal"

// import { CustomModal } from "@/app/utils/CustomModal"

// type Props = {
//   open: boolean;
//   setOpen: (open: boolean) => void;
//   activeItem: number;
//   route: string;
//   setRoute: (route: string) => void;
// }

export function Header({ open, setOpen, activeItem, route, setRoute }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [signupModalOpen, setSignupModalOpen] = useState(false)
  const [verificationModalOpen, setVerificationModalOpen] = useState(false)
  const [userEmail, setUserEmail] = useState("")

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
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">      <div className="container mx-auto px-4 py-4">
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
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" onClick={handleOpenLogin}>
                Sign In
              </Button>
              <Button onClick={handleOpenSignup}>Sign Up</Button>
            </div>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="md:hidden">
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
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
        {/* {
        route === "Login" && 
        (
          <>
            {
              open && (
                <CustomModal
                  open={open} 
                  setOpen={setOpen} 
                  activeItem={activeItem} 
                  component={<LoginModal setRoute={setRoute} />} 
                  setRoute={setRoute} 
                />
              )
            }
          </>
        )
      } */}
      </header>

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSwitchToSignup={handleOpenSignup}
      />
      <SignupModal
        isOpen={signupModalOpen}
        onClose={() => setSignupModalOpen(false)}
        onSwitchToLogin={handleOpenLogin}
        onSignupSuccess={() => handleSignupSuccess()}
      />
      <VerificationModal
        isOpen={verificationModalOpen}
        onClose={() => setVerificationModalOpen(false)}
        email={userEmail}
      />
    </>
  )
}
