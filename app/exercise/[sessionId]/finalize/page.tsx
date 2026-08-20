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

  // If already finalized, send them to their results rather than the capture form.
  // `slug` is what finalizeSession sets, and what lib/actions.ts guards on. There is
  // no `status` or `share_slug` column on `sessions`, so the check that used to be
  // here was never true and this redirect never fired.
  if (session.slug) {
    redirect(`/values/${session.slug}`)
  }

  return <EmailCaptureForm sessionId={sessionId} />
}
