"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsDark(document.documentElement.classList.contains("dark"))
  }, [])

  const setTheme = (dark: boolean) => {
    setIsDark(dark)

    if (dark) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  // Render a stable placeholder until mounted so the label doesn't flash the
  // wrong mode before the stored theme is read.
  if (!mounted) {
    return (
      <div className="flex h-9 items-center gap-2 text-sm text-muted-foreground">
        <Sun className="w-4 h-4" />
        <Switch aria-label="Toggle dark mode" disabled />
      </div>
    )
  }

  return (
    <label className="flex h-9 cursor-pointer items-center gap-2 text-sm text-muted-foreground">
      {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      <span>{isDark ? "Dark mode" : "Light mode"}</span>
      <Switch checked={isDark} onCheckedChange={setTheme} aria-label="Toggle dark mode" />
    </label>
  )
}
