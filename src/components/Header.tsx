"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Building2, BarChart3, Server, Menu, X } from "lucide-react"

export function Header() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Hospital",
      href: "/hospital",
      icon: Building2,
    },
    {
      name: "Server",
      href: "/server",
      icon: Server,
    },
    {
      name: "Overview",
      href: "/all-hospitals",
      icon: BarChart3,
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Federated Learning</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium flex-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center transition-colors hover:text-foreground/80 ${
                  isActive ? "text-foreground" : "text-foreground/60"
                }`}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
