import { redirect } from "next/navigation"
import { getSession, getSessionValues } from "@/lib/actions"
import { EmailCaptureForm } from "@/components/email-capture-form"

interface PageProps {
  params: Promise<{ sessionId: string }>
}

export default async function FinalizePage({ params }: PageProps) {
  const { sessionId } = await params
  const session = await getSession(sessionId)

  if (!session) {
    redirect("/")
  }

  // Check if they have selected core values
  const sessionValues = await getSessionValues(sessionId)
  const coreValues = sessionValues.filter((sv) => sv.is_core)

  if (coreValues.length < 4) {
    redirect(`/exercise/${sessionId}/core`)
  }

  // If already completed, redirect to summary
  if (session.status === "completed" && session.share_slug) {
    redirect(`/values/${session.share_slug}`)
  }

  return <EmailCaptureForm sessionId={sessionId} />
}
