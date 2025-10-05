import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { SidebarNav } from "@/components/sidebar-nav"

export const metadata: Metadata = {
  title: "AggieFM - Share Your Campus Soundtrack",
  description: "Share one song daily from UC Davis campus",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">
        <SidebarNav />
        <main className="ml-56 transition-all duration-300">{children}</main>
      </body>
    </html>
  )
}
