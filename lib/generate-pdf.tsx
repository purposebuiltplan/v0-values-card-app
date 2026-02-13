import React from "react"
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer"
import type { ValueCard } from "@/lib/types"

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.4,
    color: "#1a1a1a",
  },
  header: {
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#4a7c59",
    borderBottomStyle: "solid",
  },
  title: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#2d5a3d",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: "#666666",
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#2d5a3d",
    marginBottom: 10,
    marginTop: 16,
  },
  coreValueCard: {
    marginBottom: 8,
    padding: 10,
    backgroundColor: "#f0f7f2",
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: "#4a7c59",
    borderLeftStyle: "solid",
  },
  coreValueLabel: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  coreValueDescription: {
    fontSize: 10,
    color: "#555555",
    lineHeight: 1.4,
  },
  otherValuesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },
  otherValueChip: {
    backgroundColor: "#e8ede9",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 10,
    color: "#333333",
  },
  reflectionSection: {
    marginTop: 16,
  },
  reflectionItem: {
    marginBottom: 10,
  },
  reflectionPrompt: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#444444",
    marginBottom: 3,
  },
  reflectionResponse: {
    fontSize: 10,
    color: "#333333",
    lineHeight: 1.5,
    paddingLeft: 8,
    borderLeftWidth: 1,
    borderLeftColor: "#cccccc",
    borderLeftStyle: "solid",
  },
  reflectionEmpty: {
    fontSize: 10,
    color: "#999999",
    fontStyle: "italic",
    paddingLeft: 8,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 9,
    color: "#999999",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    borderTopStyle: "solid",
    paddingTop: 8,
  },
})

const REFLECTION_PROMPTS = [
  { id: "daily", prompt: "Where do you already see these values show up in your day-to-day life?" },
  { id: "tension", prompt: "Where do you feel tension or misalignment?" },
  { id: "decision", prompt: "What's one decision you could make this month to better live out these values?" },
]

interface ReportProps {
  userName: string | null
  coreValues: ValueCard[]
  otherHighValues: ValueCard[]
  reflections: Record<string, string> | null
}

function ValuesReport({ userName, coreValues, otherHighValues, reflections }: ReportProps) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {userName ? `${userName}'s Core Values` : "Your Core Values"}
          </Text>
          <Text style={styles.subtitle}>
            Purpose Built Values Card Exercise
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          Core Values ({coreValues.length})
        </Text>
        {coreValues.map((value) => (
          <View key={value.sessionValueId} style={styles.coreValueCard}>
            <Text style={styles.coreValueLabel}>
              {value.label}{value.isCustom ? " (Custom)" : ""}
            </Text>
            <Text style={styles.coreValueDescription}>
              {value.customDescription || value.description || "No description provided."}
            </Text>
          </View>
        ))}

        {otherHighValues.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>
              Other Very Important Values ({otherHighValues.length})
            </Text>
            <View style={styles.otherValuesContainer}>
              {otherHighValues.map((value) => (
                <Text key={value.sessionValueId} style={styles.otherValueChip}>
                  {value.label}
                </Text>
              ))}
            </View>
          </>
        )}

        <View style={styles.reflectionSection}>
          <Text style={styles.sectionTitle}>Reflection Prompts</Text>
          {REFLECTION_PROMPTS.map((item) => (
            <View key={item.id} style={styles.reflectionItem}>
              <Text style={styles.reflectionPrompt}>{item.prompt}</Text>
              {reflections?.[item.id] ? (
                <Text style={styles.reflectionResponse}>{reflections[item.id]}</Text>
              ) : (
                <Text style={styles.reflectionEmpty}>No response yet</Text>
              )}
            </View>
          ))}
        </View>

        <Text style={styles.footer}>Purpose Built Values Cards</Text>
      </Page>
    </Document>
  )
}

export async function generateReportPDF(
  userName: string | null,
  coreValues: ValueCard[],
  otherHighValues: ValueCard[],
  reflections: Record<string, string> | null,
): Promise<Buffer> {
  const buffer = await renderToBuffer(
    <ValuesReport
      userName={userName}
      coreValues={coreValues}
      otherHighValues={otherHighValues}
      reflections={reflections}
    />
  )
  return Buffer.from(buffer)
}
