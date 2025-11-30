"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { X, Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signupSchema, type SignupFormData } from "@/lib/validation-schemas"
import { useRegisterMutation } from "@/redux/features/auth/authApi"
import { toast } from "sonner"

type Props = {
  setRoute: (route: string) => void
}

interface SignupModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin: () => void
  onSignupSuccess: (email?: string) => void
}

export function SignupModal({
  isOpen,
  onClose,
  onSwitchToLogin,
  onSignupSuccess,
  setRoute,
}: SignupModalProps & Props) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [registerUser, { data, error: apiError, isSuccess }] = useRegisterMutation()

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema),
  })

  // Handle API results
  useEffect(() => {
    if (isSuccess) {
      const msg = data?.message || "Registration successful"
      toast.success(msg)
      onClose() // Close signup modal
      const email = getValues("email") || ""
      onSignupSuccess(email) // Pass email to parent
      reset()
      setIsLoading(false)
    }

    if (apiError) {
      const err = apiError as any
      toast.error(err?.data?.message || "Something went wrong")
      setIsLoading(false)
    }
  }, [isSuccess, apiError])

  // Submit form
  const onSubmit = async (formData: SignupFormData) => {
    setIsLoading(true)
    await registerUser(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-lg bg-background p-6 shadow-lg md:p-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">Create Account</h2>
          <p className="mt-2 text-sm text-muted-foreground">Start your learning journey today.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                {...register("name")}
                placeholder="John Smith"
                className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2"
              />
            </div>
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                {...register("email")}
                type="email"
                placeholder="your@email.com"
                className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2"
              />
            </div>
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full rounded-lg border border-input bg-background pl-10 pr-10 py-2"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                {...register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full rounded-lg border border-input bg-background pl-10 pr-10 py-2"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2">
            <input
              {...register("agreeTerms")}
              type="checkbox"
              id="agreeTerms"
              className="mt-1 h-4 w-4 rounded border-input cursor-pointer"
            />
            <label htmlFor="agreeTerms" className="text-sm text-muted-foreground">
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>
          {errors.agreeTerms && <p className="text-sm text-destructive">{errors.agreeTerms.message}</p>}

          {/* Submit */}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 border-t border-border" />
          <span className="text-sm text-muted-foreground">or</span>
          <div className="flex-1 border-t border-border" />
        </div>

        {/* Social */}
        <div className="space-y-2">
          <Button variant="outline" className="w-full bg-transparent">Sign up with Google</Button>
          <Button variant="outline" className="w-full bg-transparent">Sign up with GitHub</Button>
        </div>

        {/* Switch */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <button onClick={onSwitchToLogin} className="font-medium text-primary hover:underline">
            Sign In
          </button>
        </p>
      </div>
    </div>
  )
}
