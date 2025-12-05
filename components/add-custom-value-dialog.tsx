"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface AddCustomValueDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (label: string, description?: string) => void
}

export function AddCustomValueDialog({ open, onOpenChange, onAdd }: AddCustomValueDialogProps) {
  const [label, setLabel] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!label.trim()) return

    setIsSubmitting(true)
    await onAdd(label.trim(), description.trim() || undefined)
    setIsSubmitting(false)
    setLabel("")
    setDescription("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add your own value</DialogTitle>
          <DialogDescription>
            Is there a value that matters to you that isn't in the list? Add it here.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="value-name">Value name</Label>
              <Input
                id="value-name"
                placeholder="e.g., Creativity, Spontaneity"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="value-description">
                Short description <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="value-description"
                placeholder="A one-liner that captures what this value means to you"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!label.trim() || isSubmitting}>
              {isSubmitting ? "Adding..." : "Add to Very Important"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
