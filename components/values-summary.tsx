"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ValueCard } from "@/lib/types"
import { Star, Copy, Check, Share2, Sparkles } from "lucide-react"

interface ValuesSummaryProps {
  userName: string | null
  coreValues: ValueCard[]
  otherHighValues: ValueCard[]
  shareSlug: string
  isNew?: boolean
}

export function ValuesSummary({ userName, coreValues, otherHighValues, shareSlug, isNew = false }: ValuesSummaryProps) {
  const [copiedSummary, setCopiedSummary] = useState(false)
  const [copiedExercise, setCopiedExercise] = useState(false)

  const handleCopySummaryLink = async () => {
    const url = `${window.location.origin}/values/${shareSlug}`
    await navigator.clipboard.writeText(url)
    setCopiedSummary(true)
    setTimeout(() => setCopiedSummary(false), 2000)
  }

  const handleCopyExerciseLink = async () => {
    const url = window.location.origin
    await navigator.clipboard.writeText(url)
    setCopiedExercise(true)
    setTimeout(() => setCopiedExercise(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Success Banner for new completions */}
      {isNew && (
        <div className="bg-primary text-primary-foreground py-3 px-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Nice work! Your values summary has been saved and emailed to you.</span>
          </div>
        </div>
      )}

      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-balance">
            {userName ? `${userName}'s Core Values` : "Your Core Values"}
          </h1>
          <p className="text-muted-foreground">The values that matter most to you, all in one place.</p>
        </header>

        {/* Core Values Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-primary fill-primary" />
            Core Values ({coreValues.length})
          </h2>
          <div className="grid gap-4">
            {coreValues.map((value) => (
              <Card key={value.sessionValueId} className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Star className="w-5 h-5 text-primary fill-primary shrink-0" />
                    {value.label}
                    {value.isCustom && (
                      <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-normal">
                        Custom
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {value.customDescription || value.description || "No description provided."}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Other Very Important Values */}
        {otherHighValues.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Other Very Important Values ({otherHighValues.length})</h2>
            <div className="flex flex-wrap gap-2">
              {otherHighValues.map((value) => (
                <span
                  key={value.sessionValueId}
                  className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm"
                >
                  {value.label}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Reflection Prompts */}
        <section className="mb-10">
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">Reflection prompts</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  Where do you already see these values show up in your day-to-day life?
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  Where do you feel tension or misalignment?
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  What's one decision you could make this month to better live out these values?
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Share Section */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Share</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={handleCopySummaryLink}>
              {copiedSummary ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Link copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy link to this summary
                </>
              )}
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent" onClick={handleCopyExerciseLink}>
              {copiedExercise ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Link copied!
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 mr-2" />
                  Invite someone else to take the exercise
                </>
              )}
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>Purpose Built Values Cards</p>
        </footer>
      </main>
    </div>
  )
}
