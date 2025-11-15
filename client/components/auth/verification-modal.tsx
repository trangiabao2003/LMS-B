"use client"

import { use, useEffect, useState } from "react"
import { X, Mail, CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSelector } from "react-redux"
import { useActivationMutation } from "@/redux/features/auth/authApi"
import { toast } from "sonner"
import { set } from "date-fns"

type Props = {
  setRoute: (route: string) => void
}
interface VerificationModalProps {
  isOpen: boolean
  onClose: () => void
  email?: string
}

export function VerificationModal({ setRoute, isOpen, onClose, email = "your@email.com" }: VerificationModalProps & Props) {
  const { token } = useSelector((state: any) => state.auth)
  const [activation, {isSuccess, error}] = useActivationMutation();
  const [verificationCode, setVerificationCode] = useState(["", "", "", ""])
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    if (isSuccess) {
      toast.success("Account verified successfully")
      setRoute("Login")
    }

    if(error) {
      if('data' in error) {
      const err = error as any
      toast.error(err?.data?.message || "Verification failed")
      setIsVerifying(false);
      } else {
        console.log("An error occurred: ", error);
      }
    }
  }, [isSuccess, error]);

  const verificationHandler = async () => {
    const verificationNumber = verificationCode.join("");
    if(verificationNumber.length !== 4) {
      setIsVerifying(false);
      return;
    }

    await activation({ activation_token: token, activation_code: verificationNumber });
  }
  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newCode = [...verificationCode]
    newCode[index] = value
    setVerificationCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleContinue = () => {
    onClose()
  }

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

        {!isVerified ? (
          <>
            {/* Header */}
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Verify Email</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                We have sent a verification code to <br />
                <span className="font-medium text-foreground">{email}</span>
              </p>
            </div>

            {/* Verification Code Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-3">Enter verification code (6 digits)</label>
              <div className="flex gap-2 justify-center">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    className="h-12 w-12 rounded-lg border border-input bg-background text-center text-lg font-semibold text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="0"
                  />
                ))}
              </div>
            </div>

            {/* Verify Button */}
            <Button
              onClick={verificationHandler}
              disabled={isVerifying || verificationCode.some((code) => !code)}
              className="w-full mb-4"
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </Button>

            {/* Resend Code */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Didn't receive the code? <button className="font-medium text-primary hover:underline">Resend</button>
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Success State */}
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Verification Successful!</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Your email has been successfully verified. You can now start learning.
              </p>

              {/* Success Details */}
              <div className="mt-6 rounded-lg bg-muted p-4">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>Email verified: {email}</span>
                </div>
              </div>

              {/* Continue Button */}
              <Button onClick={handleContinue} className="w-full mt-6">
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
