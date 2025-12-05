"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { updateCoreValue, finalizeSession } from "@/lib/actions"
import type { ValueCard } from "@/lib/types"
import { ArrowRight, ArrowLeft, Star, Info, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface CoreValuesSelectionProps {
  sessionId: string
  initialCards: ValueCard[]
}

const MIN_CORE = 4
const MAX_CORE = 7

export function CoreValuesSelection({ sessionId, initialCards }: CoreValuesSelectionProps) {
  const router = useRouter()
  const [cards, setCards] = useState<ValueCard[]>(initialCards)
  const [isNavigating, setIsNavigating] = useState(false)
  const [editingDescriptions, setEditingDescriptions] = useState<Record<string, string>>({})
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const coreCards = useMemo(() => cards.filter((c) => c.isCore), [cards])
  const nonCoreCards = useMemo(() => cards.filter((c) => !c.isCore), [cards])

  const canContinue = coreCards.length >= MIN_CORE && coreCards.length <= MAX_CORE

  const showError = (message: string) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(null), 4000)
  }

  const handleToggleCore = async (card: ValueCard) => {
    const newIsCore = !card.isCore

    // Prevent selecting more than 7
    if (newIsCore && coreCards.length >= MAX_CORE) {
      showError(`You can only select ${MAX_CORE} core values. Deselect one first.`)
      return
    }

    // Optimistic update
    setCards((prev) => prev.map((c) => (c.sessionValueId === card.sessionValueId ? { ...c, isCore: newIsCore } : c)))

    try {
      const editedDesc = editingDescriptions[card.sessionValueId]
      await updateCoreValue(card.sessionValueId, newIsCore, editedDesc)
    } catch (error) {
      // Revert on error
      setCards((prev) => prev.map((c) => (c.sessionValueId === card.sessionValueId ? { ...c, isCore: !newIsCore } : c)))
      console.error("Failed to update core value:", error)
    }
  }

  const handleDescriptionChange = (sessionValueId: string, description: string) => {
    setEditingDescriptions((prev) => ({ ...prev, [sessionValueId]: description }))
  }

  const handleSaveDescription = async (card: ValueCard) => {
    const editedDesc = editingDescriptions[card.sessionValueId]
    if (editedDesc === undefined) return

    try {
      await updateCoreValue(card.sessionValueId, card.isCore, editedDesc)
      setCards((prev) =>
        prev.map((c) => (c.sessionValueId === card.sessionValueId ? { ...c, customDescription: editedDesc } : c)),
      )
    } catch (error) {
      console.error("Failed to save description:", error)
    }
  }

  const handleContinue = async () => {
    setIsNavigating(true)

    // Save all edited descriptions before navigating
    for (const card of coreCards) {
      const editedDesc = editingDescriptions[card.sessionValueId]
      if (editedDesc !== undefined && editedDesc !== card.customDescription) {
        try {
          await updateCoreValue(card.sessionValueId, true, editedDesc)
        } catch (error) {
          console.error("Failed to save description:", error)
        }
      }
    }

    try {
      console.log("[v0] Calling finalizeSession with sessionId:", sessionId)
      const session = await finalizeSession(sessionId, null)
      console.log("[v0] Session returned:", session)
      console.log("[v0] Session slug:", session?.slug)

      if (!session?.slug) {
        console.error("[v0] No slug returned from finalizeSession")
        showError("Failed to generate summary link. Please try again.")
        setIsNavigating(false)
        return
      }

      router.push(`/values/${session.slug}`)
    } catch (error) {
      console.error("[v0] Failed to finalize session:", error)
      showError("Something went wrong. Please try again.")
      setIsNavigating(false)
    }
  }

  const handleBack = () => {
    router.push(`/exercise/${sessionId}/sort`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-4 py-3">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">Step 2 of 2: Pick your Core Values</h1>
            <span className="text-sm text-muted-foreground">
              {coreCards.length} / {MAX_CORE} selected
            </span>
          </div>
        </div>
      </header>

      {errorMessage && (
        <div className="sticky top-[52px] z-20 px-4 py-2">
          <div className="max-w-5xl mx-auto">
            <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 flex items-center justify-between">
              <p className="text-sm font-medium">{errorMessage}</p>
              <button onClick={() => setErrorMessage(null)} className="p-1 hover:bg-destructive/10 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Instructions */}
        <div className="mb-6 p-4 bg-muted/50 rounded-xl border">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm text-foreground">
                From your "Very Important" cards, choose the <strong>4-7</strong> that feel absolutely essential.
              </p>
              <p className="text-sm text-muted-foreground">
                These are the ones you'd want on your personal "life dashboard."
              </p>
            </div>
          </div>
        </div>

        {/* Selected Core Values - Grid layout for side-by-side display */}
        {coreCards.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-primary fill-primary" />
              Your Core Values ({coreCards.length})
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coreCards.map((card) => {
                const currentDescription =
                  editingDescriptions[card.sessionValueId] ?? card.customDescription ?? card.description ?? ""

                return (
                  <div
                    key={card.sessionValueId}
                    className="p-4 bg-primary/5 border-2 border-primary rounded-xl flex flex-col"
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <Star className="w-4 h-4 text-primary fill-primary shrink-0" />
                        <h3 className="font-semibold text-base truncate">{card.label}</h3>
                        {card.isCustom && (
                          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">
                            Custom
                          </span>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleCore(card)}
                        className="text-muted-foreground hover:text-destructive shrink-0 h-7 px-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <label className="text-xs text-muted-foreground">Description (edit to personalize)</label>
                      <Textarea
                        value={currentDescription}
                        onChange={(e) => handleDescriptionChange(card.sessionValueId, e.target.value)}
                        onBlur={() => handleSaveDescription(card)}
                        placeholder="What does this value mean to you?"
                        rows={2}
                        className="resize-none text-sm"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Available Values - Increased grid columns */}
        <section>
          <h2 className="text-lg font-semibold mb-4">
            {coreCards.length === 0
              ? "Select your core values"
              : `Other "Very Important" values (${nonCoreCards.length})`}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {nonCoreCards.map((card) => (
              <button
                key={card.sessionValueId}
                onClick={() => handleToggleCore(card)}
                className="p-3 bg-card border rounded-xl text-left hover:border-primary hover:bg-primary/5 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 group-hover:border-primary shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm">{card.label}</h3>
                      {card.isCustom && (
                        <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Custom</span>
                      )}
                    </div>
                    {card.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{card.description}</p>
                    )}
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <span
                        className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Info className="w-4 h-4" />
                      </span>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 text-sm" side="top">
                      {card.description || "No description available"}
                    </PopoverContent>
                  </Popover>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Navigation */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to sorting
          </Button>

          <div className="flex flex-col items-center gap-2">
            {!canContinue && (
              <p className="text-sm text-muted-foreground">
                {coreCards.length < MIN_CORE
                  ? `Select at least ${MIN_CORE} core values (${coreCards.length} / ${MIN_CORE})`
                  : `You can only select up to ${MAX_CORE} core values`}
              </p>
            )}
            <Button size="lg" disabled={!canContinue || isNavigating} onClick={handleContinue} className="px-8">
              {isNavigating ? (
                "Saving..."
              ) : (
                <>
                  View My Values Summary
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
