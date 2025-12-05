"use client"

import type React from "react"

import { useState, useCallback, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ValueCardComponent } from "@/components/value-card"
import { AddCustomValueDialog } from "@/components/add-custom-value-dialog"
import { updateValuePriority, addCustomValue } from "@/lib/actions"
import type { ValueCard, Priority } from "@/lib/types"
import { ArrowRight, Plus, Info, X } from "lucide-react"

interface CardSortingExerciseProps {
  sessionId: string
  initialCards: ValueCard[]
}

const ZONES: { priority: Priority; label: string; description: string }[] = [
  { priority: "high", label: "Very Important", description: "Essential to who you are" },
  { priority: "medium", label: "Matters to Me", description: "Resonates but not top priority" },
  { priority: "low", label: "Low Priority", description: "Doesn't define you right now" },
]

const MAX_HIGH_CARDS = 15

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function CardSortingExercise({ sessionId, initialCards }: CardSortingExerciseProps) {
  const router = useRouter()
  const [cards, setCards] = useState<ValueCard[]>(initialCards)
  const [hasShuffled, setHasShuffled] = useState(false)
  const [isAddingCustom, setIsAddingCustom] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [dragOverZone, setDragOverZone] = useState<Priority | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!hasShuffled) {
      setCards((prev) => {
        const unsorted = prev.filter((c) => c.priority === "unsorted")
        const sorted = prev.filter((c) => c.priority !== "unsorted")
        return [...shuffleArray(unsorted), ...sorted]
      })
      setHasShuffled(true)
    }
  }, [hasShuffled])

  const unsortedCards = useMemo(() => cards.filter((c) => c.priority === "unsorted"), [cards])
  const highCards = useMemo(
    () => cards.filter((c) => c.priority === "high").sort((a, b) => a.label.localeCompare(b.label)),
    [cards],
  )
  const mediumCards = useMemo(
    () => cards.filter((c) => c.priority === "medium").sort((a, b) => a.label.localeCompare(b.label)),
    [cards],
  )
  const lowCards = useMemo(
    () => cards.filter((c) => c.priority === "low").sort((a, b) => a.label.localeCompare(b.label)),
    [cards],
  )

  const currentCard = unsortedCards[0] || null
  const remainingCount = unsortedCards.length - 1

  const canContinue = highCards.length >= 4
  const progress = ((cards.length - unsortedCards.length) / cards.length) * 100

  const showError = (message: string) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(null), 4000)
  }

  const handleMoveCard = useCallback(
    async (card: ValueCard, newPriority: Priority) => {
      if (newPriority === "high" && highCards.length >= MAX_HIGH_CARDS && card.priority !== "high") {
        showError(`You can only have ${MAX_HIGH_CARDS} "Very Important" values. Move one to another category first.`)
        return
      }

      setCards((prev) =>
        prev.map((c) => (c.sessionValueId === card.sessionValueId ? { ...c, priority: newPriority } : c)),
      )

      try {
        await updateValuePriority(card.sessionValueId, newPriority)
      } catch (error) {
        setCards((prev) =>
          prev.map((c) => (c.sessionValueId === card.sessionValueId ? { ...c, priority: card.priority } : c)),
        )
        console.error("Failed to update card:", error)
      }
    },
    [highCards.length],
  )

  const handleDragOver = (e: React.DragEvent, priority: Priority) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverZone(priority)
  }

  const handleDragLeave = () => {
    setDragOverZone(null)
  }

  const handleDrop = (e: React.DragEvent, priority: Priority) => {
    e.preventDefault()
    setDragOverZone(null)

    try {
      const cardData = JSON.parse(e.dataTransfer.getData("application/json")) as ValueCard
      handleMoveCard(cardData, priority)
    } catch (error) {
      console.error("Failed to parse dropped card:", error)
    }
  }

  const handleAddCustomValue = async (label: string, description?: string) => {
    if (highCards.length >= MAX_HIGH_CARDS) {
      showError(`You can only have ${MAX_HIGH_CARDS} "Very Important" values. Move one to another category first.`)
      return
    }

    try {
      const newValue = await addCustomValue(sessionId, label, description)
      const newCard: ValueCard = {
        id: newValue.id,
        sessionValueId: newValue.id,
        label: label,
        description: description || null,
        priority: "high",
        isCore: false,
        customDescription: null,
        isCustom: true,
      }
      setCards((prev) => [...prev, newCard])
      setIsAddingCustom(false)
    } catch (error) {
      console.error("Failed to add custom value:", error)
    }
  }

  const handleContinue = () => {
    setIsNavigating(true)
    router.push(`/exercise/${sessionId}/core`)
  }

  const getZoneCards = (priority: Priority) => {
    switch (priority) {
      case "high":
        return highCards
      case "medium":
        return mediumCards
      case "low":
        return lowCards
      default:
        return []
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-semibold">Step 1: Sort your values</h1>
            <span className="text-sm text-muted-foreground">
              {cards.length - unsortedCards.length} / {cards.length} sorted
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {errorMessage && (
        <div className="sticky top-[60px] z-20 px-4 py-2">
          <div className="max-w-7xl mx-auto">
            <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 flex items-center justify-between">
              <p className="text-sm font-medium">{errorMessage}</p>
              <button onClick={() => setErrorMessage(null)} className="p-1 hover:bg-destructive/10 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Instructions */}
        <div className="mb-6 p-4 bg-muted/50 rounded-xl border">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm text-foreground">
                <span className="hidden lg:inline">Drag each card to the zone that fits best. </span>
                <span className="lg:hidden">Tap the buttons to sort each card. </span>
                Is it essential to who you are, or not really you?
              </p>
              <p className="text-sm text-muted-foreground">
                Aim for <strong>10-15 cards</strong> in "Very Important" before moving on.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-6">
          {/* Current Card */}
          {currentCard ? (
            <section className="flex flex-col items-center">
              <p className="text-sm text-muted-foreground mb-3">
                {remainingCount > 0 ? `${remainingCount + 1} cards remaining` : "Last card!"}
              </p>
              <div className="w-full max-w-sm">
                <ValueCardComponent card={currentCard} onMove={handleMoveCard} prominent mobileActions />
              </div>
            </section>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg font-medium text-foreground">All cards sorted!</p>
              <p className="text-sm text-muted-foreground mt-1">Review your choices below or continue.</p>
            </div>
          )}

          {/* Sorted Zones Summary */}
          {ZONES.map((zone) => {
            const zoneCards = getZoneCards(zone.priority)
            if (zoneCards.length === 0) return null

            return (
              <section key={zone.priority}>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-medium text-foreground">{zone.label}</h2>
                  <span className="text-sm text-muted-foreground">
                    {zoneCards.length}
                    {zone.priority === "high" && ` / ${MAX_HIGH_CARDS}`}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {zoneCards.map((card) => (
                    <span key={card.sessionValueId} className="text-xs bg-muted px-2 py-1 rounded-full">
                      {card.label}
                    </span>
                  ))}
                </div>
              </section>
            )
          })}
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Left Side: Start Here - Centered */}
          <div className="flex flex-col justify-center min-h-[500px]">
            <div className="text-center mb-4">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Start Here</h2>
              {unsortedCards.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {remainingCount > 0 ? `${remainingCount} more after this` : "Last one!"}
                </p>
              )}
            </div>

            {currentCard ? (
              <div className="max-w-md mx-auto w-full">
                <ValueCardComponent card={currentCard} prominent draggable />
                <p className="text-center text-xs text-muted-foreground mt-4">Drag this card to a zone on the right</p>
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-xl border-2 border-dashed">
                <p className="text-lg font-medium text-foreground">All cards sorted!</p>
                <p className="text-sm text-muted-foreground mt-1">Review your choices or continue below.</p>
              </div>
            )}

            {/* Add Custom Value */}
            <div className="mt-8 max-w-md mx-auto w-full">
              <Button variant="outline" className="w-full bg-transparent" onClick={() => setIsAddingCustom(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add your own value
              </Button>
            </div>
          </div>

          {/* Right Side: Drop Zones - Vertical stack (High, Medium, Low) */}
          <div className="flex flex-col gap-4">
            {ZONES.map((zone) => {
              const zoneCards = getZoneCards(zone.priority)
              const isOver = dragOverZone === zone.priority

              return (
                <div
                  key={zone.priority}
                  className="flex-1 flex flex-col"
                  onDragOver={(e) => handleDragOver(e, zone.priority)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, zone.priority)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h2 className="text-sm font-medium text-foreground">{zone.label}</h2>
                      <p className="text-xs text-muted-foreground">{zone.description}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {zoneCards.length}
                      {zone.priority === "high" && ` / ${MAX_HIGH_CARDS}`}
                    </span>
                  </div>
                  <div
                    className={`
                      flex-1 min-h-[120px] p-3 rounded-xl border-2 border-dashed transition-all
                      ${isOver ? "border-primary bg-primary/5 scale-[1.02]" : "border-border bg-muted/20"}
                    `}
                  >
                    {zoneCards.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-6">Drop cards here</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {zoneCards.map((card) => (
                          <div
                            key={card.sessionValueId}
                            className="bg-card border rounded-lg px-3 py-2 text-sm font-medium shadow-sm cursor-grab"
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData("application/json", JSON.stringify(card))
                              e.dataTransfer.effectAllowed = "move"
                            }}
                          >
                            {card.label}
                            {card.isCustom && <span className="ml-1.5 text-xs text-muted-foreground">(custom)</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Mobile Add Custom Button */}
        <div className="lg:hidden mt-6">
          <Button variant="outline" className="w-full bg-transparent" onClick={() => setIsAddingCustom(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add your own value
          </Button>
        </div>

        {/* Continue Button */}
        <div className="mt-8 flex flex-col items-center gap-3">
          {!canContinue && (
            <p className="text-sm text-muted-foreground">
              Select at least 4 "Very Important" values to continue ({highCards.length} / 4)
            </p>
          )}
          <Button size="lg" disabled={!canContinue || isNavigating} onClick={handleContinue} className="px-8">
            {isNavigating ? (
              "Loading..."
            ) : (
              <>
                Next: Choose your core values
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </main>

      <AddCustomValueDialog open={isAddingCustom} onOpenChange={setIsAddingCustom} onAdd={handleAddCustomValue} />
    </div>
  )
}
