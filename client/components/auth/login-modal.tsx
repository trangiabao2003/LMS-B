"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { X, Eye, EyeOff, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { loginSchema, type LoginFormData } from "@/lib/validation-schemas"
import { authApi } from "@/redux/features/auth/authApi"
import toast from "react-hot-toast"
import { signIn } from "next-auth/react"

type Props = {
  setRoute: (route: string) => void
  setOpen: (open: boolean) => void
}
interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToSignup: () => void
}

export function LoginModal({ isOpen, onClose, onSwitchToSignup, setRoute, setOpen }: LoginModalProps & Props) {
  const [login, { isSuccess, error }] = authApi.useLoginMutation();
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    await login(data);
    // console.log("Login data:", data)
    setIsLoading(false)
    reset()
    onClose()
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success("Login successfully")
      // setOpen(false)
    }
    if (error) {
      const errorData = error as any
      toast.error(errorData?.data.message)
    }
  }, [isSuccess, error])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-lg bg-background p-6 shadow-lg md:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">Login</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Welcome back! Please log in to your account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                {...register("email")}
                type="email"
                placeholder="your@email.com"
                className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full rounded-lg border border-input bg-background pl-10 pr-10 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 rounded border-input bg-background cursor-pointer" />
              <span className="text-sm text-muted-foreground">Remember me</span>
            </label>
            <a href="#" className="text-sm text-primary hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 border-t border-border" />
          <span className="text-sm text-muted-foreground">or</span>
          <div className="flex-1 border-t border-border" />
        </div>

        {/* Social Login */}
        <div className="space-y-2">
          <Button onClick={() => signIn("google")} variant="outline" className="w-full bg-transparent">
            Login with Google
          </Button>
          <Button onClick={() => signIn("github")} variant="outline" className="w-full bg-transparent">
            Login with GitHub
          </Button>
        </div>

        {/* Switch to Signup */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Do you have an account?{" "}
          <button onClick={onSwitchToSignup} className="font-medium text-primary hover:underline">
            Sign Up Now
          </button>
        </p>
      </div>
    </div>
  )
}
