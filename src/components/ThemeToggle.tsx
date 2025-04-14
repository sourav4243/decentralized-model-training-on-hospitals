"use client"

import { useTheme } from "@/components/ThemeProvider"
import { Moon, Sun } from "lucide-react"
import { useState, useEffect } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative">
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 text-yellow-500 dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 text-blue-500 dark:rotate-0 dark:scale-100" />
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute right-0 top-full mt-2 w-36 rounded-md bg-popover border border-border px-3 py-1.5 text-xs text-popover-foreground shadow-md transition-opacity duration-200">
          Switch to {theme === "light" ? "dark" : "light"} mode
        </div>
      )}
    </div>
  )
}
