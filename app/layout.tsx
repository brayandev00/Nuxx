import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { TenantProvider } from "@/lib/tenant-context"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nuux - Professional Management Suite",
  description: "Suite de gestión profesional de vanguardia tecnológica",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#10B981",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} font-sans antialiased`}>
        <TenantProvider>{children}</TenantProvider>
        <Analytics />
      </body>
    </html>
  )
}
