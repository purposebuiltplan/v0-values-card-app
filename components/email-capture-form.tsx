"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { finalizeSession } from "@/lib/actions"
import { Sparkles, Copy, Check, ArrowLeft } from "lucide-react"

interface EmailCaptureFormProps {
  sessionId: string
}

export function EmailCaptureForm({ sessionId }: EmailCaptureFormProps) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const session = await finalizeSession(sessionId, name.trim() || null)

      if (session.slug) {
        router.push(`/values/${session.slug}?new=true`)
      }
    } catch (err) {
      console.error("Failed to finalize session:", err)
      setError("Something went wrong. Please try again.")
      setIsSubmitting(false)
    }
  }

  const handleCopyExerciseLink = async () => {
    const url = window.location.origin
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleBack = () => {
    router.push(`/exercise/${sessionId}/core`)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">You're all set!</CardTitle>
            <CardDescription className="text-base">
              Ready to see your values summary? Add your name if you'd like it personalized.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input id="name" placeholder="Your first name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Loading..." : "View My Summary"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <Button variant="outline" className="w-full bg-transparent" onClick={handleCopyExerciseLink}>
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Link copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy link so someone else can take this too
                  </>
                )}
              </Button>
            </div>

            <div className="mt-4">
              <Button variant="ghost" className="w-full" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to core values
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
