"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createSession } from "@/lib/actions"
import { Sparkles, ArrowRight, Heart, Target, Mail } from "lucide-react"

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
            Clarify your core values in just a few minutes
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground text-pretty max-w-xl mx-auto">
            Sort a stack of value cards, pick your Core 4-7, and get a personalized summary to keep.
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

          <p className="text-sm text-muted-foreground">Takes about 10-15 minutes. No account required.</p>
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
                Move 60 value cards into three priority levels: Very Important, Matters to Me, or Low Priority.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center">
                <Heart className="w-8 h-8 text-accent-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Pick your Core 4-7</h3>
              <p className="text-muted-foreground">
                From your top values, choose the 4-7 that feel absolutely essential to who you are.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Get your summary</h3>
              <p className="text-muted-foreground">
                Receive a personalized values report you can revisit, reflect on, and share with others.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-sm text-muted-foreground border-t">
        <p>Purpose Built Values Cards</p>
      </footer>
    </main>
  )
}
