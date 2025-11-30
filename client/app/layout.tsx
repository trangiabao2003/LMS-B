"use client"

import type React from "react"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "./provider"
import { Toaster } from "react-hot-toast"
import { SessionProvider } from "next-auth/react"
import { useLoadUserQuery } from "@/redux/features/api/apiSlice"
import { FC } from "react"
import Loader from "@/components/Loader/Loader"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <Providers>
          <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <Custom>{children}</Custom>
              <Toaster position="top-center" reverseOrder={false} />
            </ThemeProvider>
          </SessionProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}

const Custom: FC<{ children: React.ReactNode }> = ({ children }) => {

  const { isLoading } = useLoadUserQuery({});

  return (
    <>
      {
        isLoading ? <Loader /> : <>{children} </>
      }
    </>
  )
}