import { notFound } from "next/navigation"
import { getSessionBySlug, getSessionValuesBySlug } from "@/lib/actions"
import { ValuesSummary } from "@/components/values-summary"
import type { ValueCard } from "@/lib/types"

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ new?: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const session = await getSessionBySlug(slug)

  if (!session) {
    return { title: "Values Summary Not Found" }
  }

  const name = session.user_name || "Someone"
  return {
    title: `${name}'s Core Values | Purpose Built Values Cards`,
    description: `See ${name}'s core values from the Purpose Built Values Cards exercise.`,
  }
}

export default async function ValuesSummaryPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { new: isNew } = await searchParams

  const session = await getSessionBySlug(slug)

  if (!session) {
    notFound()
  }

  const sessionValues = await getSessionValuesBySlug(slug)

  const allCards: ValueCard[] = sessionValues.map((sv) => ({
    id: sv.value_master_id || sv.id,
    sessionValueId: sv.id,
    label: sv.custom_label || sv.values_master?.label || "Unknown",
    description: sv.custom_description || sv.values_master?.description || null,
    priority: sv.priority,
    isCore: sv.is_core,
    customDescription: sv.custom_description,
    isCustom: !sv.value_master_id,
  }))

  const coreValues = allCards.filter((c) => c.isCore)
  const otherHighValues = allCards.filter((c) => c.priority === "high" && !c.isCore)

  return (
    <ValuesSummary
      userName={session.user_name}
      coreValues={coreValues}
      otherHighValues={otherHighValues}
      shareSlug={slug}
      sessionId={session.id}
      isNew={isNew === "true"}
      initialReflections={session.reflection_responses}
    />
  )
}
