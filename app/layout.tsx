import type React from "react"
import type { Metadata, Viewport } from "next"
import { Fraunces, Barlow_Condensed, Roboto } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SiteHeader } from "@/components/site-header"
import "./globals.css"

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
})
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow-condensed",
  display: "swap",
})
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Purpose Built Values Cards",
  description:
    "Clarify your core values in just a few minutes. Sort value cards, pick your Core 4-7, and get a fun summary emailed to you.",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6eddf" },
    { media: "(prefers-color-scheme: dark)", color: "#15303f" },
  ],
  width: "device-width",
  initialScale: 1,
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const stored = localStorage.getItem('theme');
              const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              if (stored === 'dark' || (!stored && prefersDark)) {
                document.documentElement.classList.add('dark');
              }
            })();
          `,
        }}
      />
      {children}
    </>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`bg-background ${fraunces.variable} ${barlowCondensed.variable} ${roboto.variable}`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider>
          <SiteHeader />
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
