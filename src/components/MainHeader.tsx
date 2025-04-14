"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Building2, BarChart3, Server, Menu, X } from "lucide-react"

export function MainHeader() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
            <span className="font-bold text-xl hidden md:inline-block">Federated Learning</span>
            <span className="font-bold text-xl md:hidden">FL</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center transition-colors hover:text-primary ${
                  isActive
                    ? "text-foreground font-semibold border-b-2 border-primary pb-1"
                    : "text-muted-foreground"
                }`}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t py-4 px-6 bg-background">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center transition-colors hover:text-primary ${
                    isActive
                      ? "text-foreground font-semibold bg-accent/50 -mx-2 px-2 py-1 rounded"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
