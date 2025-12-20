"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createSession } from "@/lib/actions"
import { Sparkles, ArrowRight, Heart, Target, FileText } from "lucide-react"

export function LandingPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleStart() {
    setIsLoading(true)
    try {
      const session = await createSession()
      router.push(`/exercise/${session.id}/sort`)
    } catch (error) {
      console.error("Failed to create session:", error)
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>Free values exercise</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
            Values Card Exercise: Clarify your core values in just a few minutes
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground text-pretty max-w-xl mx-auto">
            Sort and reflect on a set of values to identify the few that matter most to you, and capture them in a
            clear, personalized summary.
          </p>

          <Button size="lg" onClick={handleStart} disabled={isLoading} className="text-lg px-8 py-6 h-auto gap-2">
            {isLoading ? (
              "Creating your session..."
            ) : (
              <>
                Start the values card exercise
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>

          <p className="text-sm text-muted-foreground">Takes about 10 minutes. No account required.</p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-secondary/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">How it works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Sort your values</h3>
              <p className="text-muted-foreground">
                Move through a set of value cards and sort them based on how important they feel to you.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center">
                <Heart className="w-8 h-8 text-accent-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Choose your Core Values</h3>
              <p className="text-muted-foreground">
                From your top values, choose the 4-7 that feel absolutely essential to who you are.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Review your summary</h3>
              <p className="text-muted-foreground">
                See your core values captured in a simple summary you can download, reflect on, and revisit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-primary/10 border-2 border-primary/20 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Financial clarity for faith-driven founders.</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Enjoyed this exercise? Each week I share simple, purposeful tools to help founders slow down, get clear,
              and make intentional decisions for their life, family, and finances.
            </p>
            <Button size="lg" asChild className="text-lg px-8 py-6 h-auto">
              <a href="https://purposebuilt.kit.com/weekly" target="_blank" rel="noopener noreferrer">
                Subscribe to the newsletter
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-sm text-muted-foreground border-t">
        <p>Part of the Purpose Built Framework™</p>
      </footer>
    </main>
  )
}
