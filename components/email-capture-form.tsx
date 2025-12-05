"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { finalizeSession, getSessionValues } from "@/lib/actions"
import { Mail, Copy, Check, ArrowLeft } from "lucide-react"

interface EmailCaptureFormProps {
  sessionId: string
}

export function EmailCaptureForm({ sessionId }: EmailCaptureFormProps) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim()) {
      setError("Please enter your email address")
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)

    try {
      const session = await finalizeSession(sessionId, name.trim() || null, email.trim())
      console.log("[v0] Session finalized:", session)

      if (session.slug) {
        const sessionValues = await getSessionValues(sessionId)
        console.log("[v0] Session values fetched:", sessionValues.length)

        const coreValues = sessionValues
          .filter((sv) => sv.is_core)
          .map((sv) => ({
            label: sv.custom_label || sv.values_master?.label || "Unknown",
            description: sv.custom_description || sv.values_master?.description,
          }))

        const otherImportantValues = sessionValues
          .filter((sv) => sv.priority === "high" && !sv.is_core)
          .map((sv) => ({
            label: sv.custom_label || sv.values_master?.label || "Unknown",
          }))

        const shareUrl = `${window.location.origin}/values/${session.slug}`

        console.log("[v0] Sending email to:", email.trim())
        console.log("[v0] Core values:", coreValues)

        const emailResponse = await fetch("/api/send-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            name: name.trim() || null,
            shareUrl,
            coreValues,
            otherImportantValues,
          }),
        })

        const emailResult = await emailResponse.json()
        console.log("[v0] Email API response:", emailResult)

        if (!emailResponse.ok) {
          console.error("[v0] Email send failed:", emailResult)
        }

        router.push(`/values/${session.slug}?new=true`)
      }
    } catch (err) {
      console.error("[v0] Failed to finalize session:", err)
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
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Almost done!</CardTitle>
            <CardDescription className="text-base">
              Drop in your email and we'll send a tidy little report you can revisit or share.
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

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send me my values summary"}
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
