"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Map, Plus, User, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", icon: Home, label: "Feed" },
  { href: "/map", icon: Map, label: "Map" },
  { href: "/create", icon: Plus, label: "Create" },
  { href: "/profile", icon: User, label: "Profile" },
]

export function SidebarNav() {
  const [isExpanded, setIsExpanded] = useState(true)
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 h-screen border-r border-border bg-card transition-all duration-300",
        isExpanded ? "w-56" : "w-16",
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo/Brand */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {isExpanded && <h1 className="text-xl font-bold text-foreground">AggieFM</h1>}
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8", !isExpanded && "mx-auto")}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    !isExpanded && "justify-center px-2",
                    isActive && "bg-accent/50 text-accent-foreground",
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {isExpanded && <span>{item.label}</span>}
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
