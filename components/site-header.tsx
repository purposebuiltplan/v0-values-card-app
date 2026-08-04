import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm print:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center" aria-label="Purpose Financial Planning home">
          {/* Color logo for light mode */}
          <img
            src="/images/purpose-logo-color.png"
            alt="Purpose Financial Planning"
            className="block h-11 w-auto md:h-12 dark:hidden"
          />
          {/* White / reversed logo for dark mode */}
          <img
            src="/images/purpose-logo-white.png"
            alt="Purpose Financial Planning"
            className="hidden h-11 w-auto md:h-12 dark:block"
          />
        </Link>

        <ThemeToggle />
      </div>
    </header>
  )
}
