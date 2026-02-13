import { jsPDF } from "jspdf"
import type { ValueCard } from "@/lib/types"

const REFLECTION_PROMPTS = [
  { id: "daily", prompt: "Where do you already see these values show up in your day-to-day life?" },
  { id: "tension", prompt: "Where do you feel tension or misalignment?" },
  { id: "decision", prompt: "What's one decision you could make this month to better live out these values?" },
]

const COLORS = {
  primary: "#2d5a3d",
  primaryLight: "#f0f7f2",
  accent: "#4a7c59",
  text: "#1a1a1a",
  textMuted: "#555555",
  textLight: "#999999",
  chipBg: "#e8ede9",
  border: "#e0e0e0",
}

export function generateReportPDF(
  userName: string | null,
  coreValues: ValueCard[],
  otherHighValues: ValueCard[],
  reflections: Record<string, string> | null,
): Buffer {
  const doc = new jsPDF({ unit: "pt", format: "letter" })
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 40
  const contentWidth = pageWidth - margin * 2
  let y = margin

  // Helper: add new page if needed
  function checkPage(needed: number) {
    const pageHeight = doc.internal.pageSize.getHeight()
    if (y + needed > pageHeight - 50) {
      doc.addPage()
      y = margin
    }
  }

  // Helper: wrap text and return lines
  function wrapText(text: string, maxWidth: number, fontSize: number): string[] {
    doc.setFontSize(fontSize)
    return doc.splitTextToSize(text, maxWidth) as string[]
  }

  // ── Header ──
  doc.setFont("helvetica", "bold")
  doc.setFontSize(22)
  doc.setTextColor(COLORS.primary)
  const title = userName ? `${userName}'s Core Values` : "Your Core Values"
  doc.text(title, margin, y + 22)
  y += 30

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.setTextColor(COLORS.textMuted)
  doc.text("Purpose Built Values Card Exercise", margin, y + 10)
  y += 18

  // Divider
  doc.setDrawColor(COLORS.accent)
  doc.setLineWidth(2)
  doc.line(margin, y, pageWidth - margin, y)
  y += 20

  // ── Core Values Section ──
  doc.setFont("helvetica", "bold")
  doc.setFontSize(14)
  doc.setTextColor(COLORS.primary)
  doc.text(`Core Values (${coreValues.length})`, margin, y + 14)
  y += 26

  for (const value of coreValues) {
    const label = value.label + (value.isCustom ? " (Custom)" : "")
    const desc = value.customDescription || value.description || "No description provided."
    const descLines = wrapText(desc, contentWidth - 26, 10)
    const cardHeight = 16 + descLines.length * 13 + 10

    checkPage(cardHeight)

    // Card background
    doc.setFillColor(COLORS.primaryLight)
    doc.roundedRect(margin, y, contentWidth, cardHeight, 3, 3, "F")

    // Left accent bar
    doc.setFillColor(COLORS.accent)
    doc.rect(margin, y, 3, cardHeight, "F")

    // Label
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.setTextColor(COLORS.text)
    doc.text(label, margin + 12, y + 14)

    // Description
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.setTextColor(COLORS.textMuted)
    doc.text(descLines, margin + 12, y + 28)

    y += cardHeight + 8
  }

  // ── Other Important Values ──
  if (otherHighValues.length > 0) {
    checkPage(60)
    y += 8
    doc.setFont("helvetica", "bold")
    doc.setFontSize(14)
    doc.setTextColor(COLORS.primary)
    doc.text(`Other Very Important Values (${otherHighValues.length})`, margin, y + 14)
    y += 28

    // Render as chips in a row, wrapping as needed
    let chipX = margin
    const chipH = 20
    const chipPadX = 12
    const chipGap = 6

    for (const value of otherHighValues) {
      doc.setFontSize(10)
      const textW = doc.getTextWidth(value.label)
      const chipW = textW + chipPadX * 2

      if (chipX + chipW > pageWidth - margin) {
        chipX = margin
        y += chipH + chipGap
        checkPage(chipH + chipGap)
      }

      doc.setFillColor(COLORS.chipBg)
      doc.roundedRect(chipX, y, chipW, chipH, 10, 10, "F")
      doc.setFont("helvetica", "normal")
      doc.setTextColor(COLORS.text)
      doc.text(value.label, chipX + chipPadX, y + 13)

      chipX += chipW + chipGap
    }

    y += chipH + 12
  }

  // ── Reflection Prompts ──
  checkPage(60)
  y += 8
  doc.setFont("helvetica", "bold")
  doc.setFontSize(14)
  doc.setTextColor(COLORS.primary)
  doc.text("Reflection Prompts", margin, y + 14)
  y += 28

  for (const item of REFLECTION_PROMPTS) {
    const promptLines = wrapText(item.prompt, contentWidth, 10)
    const response = reflections?.[item.id]
    const responseLines = response
      ? wrapText(response, contentWidth - 12, 10)
      : ["No response yet"]

    const totalHeight = promptLines.length * 13 + responseLines.length * 13 + 12
    checkPage(totalHeight)

    // Prompt text (bold)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(10)
    doc.setTextColor("#444444")
    doc.text(promptLines, margin, y + 10)
    y += promptLines.length * 13 + 4

    // Response text
    if (response) {
      doc.setFont("helvetica", "normal")
      doc.setTextColor(COLORS.text)
    } else {
      doc.setFont("helvetica", "italic")
      doc.setTextColor(COLORS.textLight)
    }
    doc.setFontSize(10)

    // Left border for response
    doc.setDrawColor("#cccccc")
    doc.setLineWidth(1)
    const responseHeight = responseLines.length * 13
    doc.line(margin + 6, y + 2, margin + 6, y + responseHeight + 4)

    doc.text(responseLines, margin + 12, y + 10)
    y += responseHeight + 14
  }

  // ── Footer ──
  const pageHeight = doc.internal.pageSize.getHeight()
  doc.setDrawColor(COLORS.border)
  doc.setLineWidth(0.5)
  doc.line(margin, pageHeight - 40, pageWidth - margin, pageHeight - 40)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(COLORS.textLight)
  doc.text("Purpose Built Values Cards", pageWidth / 2, pageHeight - 26, { align: "center" })

  // Return as Buffer
  const arrayBuffer = doc.output("arraybuffer")
  return Buffer.from(arrayBuffer)
}
