"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { ValueCard, Priority } from "@/lib/types"
import { Info, Star, Check, X, GripVertical } from "lucide-react"

interface ValueCardComponentProps {
  card: ValueCard
  onMove?: (card: ValueCard, newPriority: Priority) => void
  showQuickActions?: boolean
  compact?: boolean
  selectable?: boolean
  selected?: boolean
  onSelect?: (card: ValueCard) => void
  draggable?: boolean
  prominent?: boolean
  mobileActions?: boolean
}

export function ValueCardComponent({
  card,
  onMove,
  showQuickActions = false,
  compact = false,
  selectable = false,
  selected = false,
  onSelect,
  draggable = false,
  prominent = false,
  mobileActions = false,
}: ValueCardComponentProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const handleQuickMove = (priority: Priority) => {
    if (onMove) {
      onMove(card, priority)
    }
  }

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true)
    e.dataTransfer.setData("application/json", JSON.stringify(card))
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  return (
    <div
      className={`
        group relative bg-card rounded-xl border shadow-sm transition-all
        ${compact ? "p-3" : prominent ? "p-6" : "p-4"}
        ${selectable ? "cursor-pointer hover:border-primary" : ""}
        ${selected ? "ring-2 ring-primary border-primary bg-primary/5" : ""}
        ${card.isCustom ? "border-dashed" : ""}
        ${draggable ? "cursor-grab active:cursor-grabbing" : ""}
        ${isDragging ? "opacity-50 scale-95" : ""}
        ${prominent ? "shadow-lg border-2" : ""}
      `}
      onClick={() => selectable && onSelect?.(card)}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex items-start gap-3">
        {draggable && (
          <div className="hidden lg:flex items-center text-muted-foreground/50 -ml-1">
            <GripVertical className="w-5 h-5" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-center gap-2">
            <span
              className={`font-semibold text-center ${prominent ? "text-xl" : compact ? "text-sm" : "text-base"} ${prominent ? "" : "truncate"}`}
            >
              {card.label}
            </span>
            {card.isCustom && (
              <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Custom</span>
            )}
          </div>

          {prominent && card.description && (
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed text-center">{card.description}</p>
          )}
        </div>

        {!prominent && card.description && (
          <Popover open={showTooltip} onOpenChange={setShowTooltip}>
            <PopoverTrigger asChild>
              <button
                className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowTooltip(!showTooltip)
                }}
              >
                <Info className="w-4 h-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 text-sm" side="top">
              {card.description}
            </PopoverContent>
          </Popover>
        )}
      </div>

      {mobileActions && onMove && (
        <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
          <Button
            variant={card.priority === "high" ? "default" : "outline"}
            size="sm"
            className="w-full h-11 text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation()
              handleQuickMove("high")
            }}
          >
            <Star className="w-4 h-4 mr-2" />
            Very Important
          </Button>
          <div className="flex gap-2">
            <Button
              variant={card.priority === "medium" ? "secondary" : "outline"}
              size="sm"
              className="flex-1 h-10 text-sm"
              onClick={(e) => {
                e.stopPropagation()
                handleQuickMove("medium")
              }}
            >
              <Check className="w-4 h-4 mr-1.5" />
              Matters
            </Button>
            <Button
              variant={card.priority === "low" ? "secondary" : "outline"}
              size="sm"
              className="flex-1 h-10 text-sm"
              onClick={(e) => {
                e.stopPropagation()
                handleQuickMove("low")
              }}
            >
              <X className="w-4 h-4 mr-1.5" />
              Not Me
            </Button>
          </div>
        </div>
      )}

      {showQuickActions && !mobileActions && onMove && (
        <div className="flex gap-1 mt-2 pt-2 border-t lg:hidden">
          <Button
            variant={card.priority === "high" ? "default" : "outline"}
            size="sm"
            className="flex-1 h-8 text-xs"
            onClick={(e) => {
              e.stopPropagation()
              handleQuickMove("high")
            }}
          >
            <Star className="w-3 h-3 mr-1" />
            Important
          </Button>
          <Button
            variant={card.priority === "medium" ? "secondary" : "outline"}
            size="sm"
            className="flex-1 h-8 text-xs"
            onClick={(e) => {
              e.stopPropagation()
              handleQuickMove("medium")
            }}
          >
            <Check className="w-3 h-3 mr-1" />
            Matters
          </Button>
          <Button
            variant={card.priority === "low" ? "secondary" : "outline"}
            size="sm"
            className="flex-1 h-8 text-xs"
            onClick={(e) => {
              e.stopPropagation()
              handleQuickMove("low")
            }}
          >
            <X className="w-3 h-3 mr-1" />
            Not Me
          </Button>
        </div>
      )}
    </div>
  )
}
