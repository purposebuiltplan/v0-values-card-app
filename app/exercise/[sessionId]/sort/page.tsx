import { redirect } from "next/navigation"
import { getSession, getSessionValues } from "@/lib/actions"
import { CardSortingExercise } from "@/components/card-sorting-exercise"
import type { ValueCard } from "@/lib/types"

interface PageProps {
  params: Promise<{ sessionId: string }>
}

export default async function SortPage({ params }: PageProps) {
  const { sessionId } = await params
  const session = await getSession(sessionId)

  if (!session) {
    redirect("/")
  }

  const sessionValues = await getSessionValues(sessionId)

  const valueCards: ValueCard[] = sessionValues.map((sv) => ({
    id: sv.value_master_id || sv.id,
    sessionValueId: sv.id,
    label: sv.custom_label || sv.values_master?.label || "Unknown",
    description: sv.custom_description || sv.values_master?.description || null,
    priority: sv.priority,
    isCore: sv.is_core,
    customDescription: sv.custom_description,
    isCustom: !sv.value_master_id,
  }))

  return <CardSortingExercise sessionId={sessionId} initialCards={valueCards} />
}
