"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import type { ValueCard } from "@/lib/types"
import { saveReflectionResponses } from "@/lib/actions"
import { Star, Download, Share2, Sparkles, Save, Check, ArrowLeft, Home, Mail, Lightbulb } from "lucide-react"

interface ValuesSummaryProps {
  userName: string | null
  coreValues: ValueCard[]
  otherHighValues: ValueCard[]
  shareSlug: string
  sessionId: string
  isNew?: boolean
  initialReflections?: Record<string, string> | null
}

const REFLECTION_PROMPTS = [
  { id: "daily", prompt: "Where do you already see these values show up in your day-to-day life?" },
  { id: "tension", prompt: "Where do you feel tension or misalignment?" },
  { id: "decision", prompt: "What's one decision you could make this month to better live out these values?" },
]

export function ValuesSummary({
  userName,
  coreValues,
  otherHighValues,
  shareSlug,
  sessionId,
  isNew = false,
  initialReflections = null,
}: ValuesSummaryProps) {
  const router = useRouter()
  const [reflections, setReflections] = useState<Record<string, string>>(initialReflections || {})
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(async () => {
      if (Object.keys(reflections).length > 0) {
        setIsSaving(true)
        try {
          await saveReflectionResponses(shareSlug, reflections)
          setSaved(true)
          setTimeout(() => setSaved(false), 2000)
        } catch (err) {
          console.error("Failed to save reflections:", err)
        }
        setIsSaving(false)
      }
    }, 1000)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [reflections, shareSlug])

  const handleReflectionChange = (id: string, value: string) => {
    setReflections((prev) => ({ ...prev, [id]: value }))
  }

  const handleDownloadPDF = () => {
    window.print()
  }

  const handleShareExercise = () => {
    const subject = encodeURIComponent("Try this values exercise!")
    const body = encodeURIComponent(
      `Hey!\n\nI just completed a values card exercise that helped me clarify what matters most to me. I thought you might enjoy it too!\n\nTry it here: ${window.location.origin}\n\nIt only takes about 10-15 minutes and gives you a nice summary of your core values at the end.`,
    )
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin)
    alert("Link copied to clipboard!")
  }

  return (
    <div className="min-h-screen bg-background print:min-h-0 print:bg-transparent">
      {/* Success Banner for new completions */}
      {isNew && (
        <div className="bg-primary text-primary-foreground py-3 px-4 text-center print:hidden">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Nice work! Your values summary is ready.</span>
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12 print:py-0 print:px-0 print:max-w-none">
        <div className="mb-6 flex items-center justify-between print:hidden">
          <Button
            variant="ghost"
            onClick={() => router.push(`/exercise/${sessionId}/core`)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to edit selections
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="text-muted-foreground hover:text-foreground"
          >
            <Home className="w-4 h-4 mr-2" />
            Start Over
          </Button>
        </div>

        {/* Header - compact for print */}
        <header className="text-center mb-10 print:mb-4 print:text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-balance print:text-xl print:mb-1">
            {userName ? `${userName}'s Core Values` : "Your Core Values"}
          </h1>
          <p className="text-muted-foreground print:text-xs">The values that matter most to you, all in one place.</p>
        </header>

        <section className="mb-10 print:mb-3">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 print:text-base print:mb-2">
            <Star className="w-5 h-5 text-primary fill-primary print:w-4 print:h-4" />
            Core Values ({coreValues.length})
          </h2>
          <div className="grid gap-4 print:grid-cols-2 print:gap-2">
            {coreValues.map((value) => (
              <Card
                key={value.sessionValueId}
                className="border-primary/20 bg-primary/5 print:shadow-none print:border print:p-2"
              >
                <CardHeader className="pb-2 print:p-0 print:pb-1">
                  <CardTitle className="flex items-center gap-2 text-lg print:text-sm print:font-semibold">
                    <Star className="w-5 h-5 text-primary fill-primary shrink-0 print:w-3 print:h-3" />
                    {value.label}
                    {value.isCustom && (
                      <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-normal print:text-[9px] print:px-1">
                        Custom
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="print:p-0">
                  <p className="text-muted-foreground print:text-xs print:leading-tight">
                    {value.customDescription || value.description || "No description provided."}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {otherHighValues.length > 0 && (
          <section className="mb-10 print:mb-3">
            <h2 className="text-xl font-semibold mb-4 print:text-base print:mb-2">
              Other Very Important Values ({otherHighValues.length})
            </h2>
            <div className="flex flex-wrap gap-2 print:gap-1">
              {otherHighValues.map((value) => (
                <span
                  key={value.sessionValueId}
                  className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm print:text-xs print:px-2 print:py-0.5"
                >
                  {value.label}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="mb-10 print:mb-0">
          <Card className="bg-muted/50 print:bg-transparent print:shadow-none print:border-none">
            <CardHeader className="print:p-0 print:pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg print:text-base">Reflection prompts</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground print:hidden">
                  {isSaving && (
                    <>
                      <Save className="w-4 h-4 animate-pulse" />
                      <span>Saving...</span>
                    </>
                  )}
                  {saved && !isSaving && (
                    <>
                      <Check className="w-4 h-4 text-primary" />
                      <span>Saved</span>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 print:space-y-2 print:p-0">
              {REFLECTION_PROMPTS.map((item) => (
                <div key={item.id} className="space-y-2 print:space-y-1">
                  <label className="flex gap-3 text-muted-foreground print:text-xs print:gap-1">
                    <span className="text-primary">•</span>
                    {item.prompt}
                  </label>
                  {/* Screen: show textarea */}
                  <Textarea
                    placeholder="Type your thoughts here..."
                    value={reflections[item.id] || ""}
                    onChange={(e) => handleReflectionChange(item.id, e.target.value)}
                    className="min-h-[100px] bg-background print:hidden"
                  />
                  {/* Print: show text directly */}
                  <p className="hidden print:block text-xs whitespace-pre-wrap border-b border-dashed border-muted-foreground/30 pb-1 min-h-[2em]">
                    {reflections[item.id] || ""}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Actions - hidden in print */}
        <section className="space-y-3 print:hidden">
          <div className="flex justify-center">
            <Button variant="default" onClick={handleDownloadPDF} className="max-w-sm">
              <Download className="w-4 h-4 mr-2" />
              Download PDF Report
            </Button>
          </div>
        </section>

        {/* What's Next section with three CTAs */}
        <section className="mt-20 print:hidden">
          <h2 className="text-2xl font-bold text-center mb-8">What's Next</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Share Exercise */}
            <Card className="bg-secondary/50 border border-border hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Share2 className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Share Exercise</h3>
                  <p className="text-sm text-muted-foreground mb-4">Send this assessment to friends or family</p>
                </div>
                <Button variant="outline" className="w-full bg-background" onClick={handleCopyLink}>
                  Copy Share Link
                </Button>
              </CardContent>
            </Card>

            {/* Newsletter */}
            <Card className="bg-secondary/50 border border-border hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Financial clarity for faith-driven founders.</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Enjoyed this exercise? Each week I share simple, purposeful tools to help founders slow down, get
                    clear, and make intentional decisions for their life, family, and finances.
                  </p>
                </div>
                <Button className="w-full" asChild>
                  <a href="https://purposebuilt.kit.com/weekly" target="_blank" rel="noopener noreferrer">
                    Subscribe
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Balance Wheel Exercise */}
            <Card className="bg-secondary/50 border border-border hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Balance Wheel Exercise</h3>
                  <p className="text-sm text-muted-foreground mb-4">Assess life balance across key areas in minutes</p>
                </div>
                <Button variant="outline" className="w-full bg-background" asChild>
                  <a href="https://v0-balance-wheel-app.vercel.app/" target="_blank" rel="noopener noreferrer">
                    Try It Now
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer - minimal for print */}
        <footer className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground print:mt-4 print:pt-2 print:text-xs">
          <p>Purpose Built Values Cards</p>
        </footer>
      </main>
    </div>
  )
}
