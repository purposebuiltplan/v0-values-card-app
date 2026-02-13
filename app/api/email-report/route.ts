import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { createClient } from "@/lib/supabase/server"
import { generateReportPDF } from "@/lib/generate-pdf"
import type { ValueCard } from "@/lib/types"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { toEmail, fromEmail, fromName, shareSlug } = await request.json()

    // Validate required fields
    if (!toEmail || !fromEmail || !fromName || !shareSlug) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 })
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(toEmail) || !emailRegex.test(fromEmail)) {
      return NextResponse.json({ error: "Please enter valid email addresses." }, { status: 400 })
    }

    // Fetch session data from Supabase
    const supabase = await createClient()

    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .select("*")
      .eq("slug", shareSlug)
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: "Session not found." }, { status: 404 })
    }

    const { data: sessionValues, error: valuesError } = await supabase
      .from("session_values")
      .select(`
        *,
        values_master (*)
      `)
      .eq("session_id", session.id)

    if (valuesError || !sessionValues) {
      return NextResponse.json({ error: "Failed to load values data." }, { status: 500 })
    }

    // Map to ValueCard format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allCards: ValueCard[] = sessionValues.map((sv: any) => ({
      id: sv.value_master_id || sv.id,
      sessionValueId: sv.id,
      label: sv.custom_label || sv.values_master?.label || "Unknown",
      description: sv.custom_description || sv.values_master?.description || null,
      priority: sv.priority,
      isCore: sv.is_core,
      customDescription: sv.custom_description || null,
      isCustom: !sv.value_master_id,
    }))

    const coreValues = allCards.filter((c) => c.isCore)
    const otherHighValues = allCards.filter((c) => c.priority === "high" && !c.isCore)

    // Generate PDF
    const pdfBuffer = await generateReportPDF(
      session.user_name,
      coreValues,
      otherHighValues,
      session.reflection_responses,
    )

    // Build the app URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://v0-values-card-app.vercel.app")

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <p style="color: #444; font-size: 16px; line-height: 1.6;">
          Hi,
        </p>

        <p style="color: #444; font-size: 16px; line-height: 1.6;">
          ${fromName} wanted to share their results from the Values Card Exercise. Please see the attached report to view them.
        </p>

        <p style="color: #444; font-size: 16px; line-height: 1.6;">
          <a href="${appUrl}" style="color: #2d5a3d; text-decoration: underline;">Click here</a> to complete your own Values Card exercise for free.
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />

        <p style="color: #999; font-size: 12px;">
          Purpose Built Values Cards
        </p>
      </div>
    `

    const { data, error } = await resend.emails.send({
      from: "Purpose Built <onboarding@resend.dev>",
      replyTo: fromEmail,
      to: toEmail,
      subject: `${fromName} shared their Values Card Results with You`,
      html,
      attachments: [
        {
          filename: `${fromName.replace(/[^a-zA-Z0-9 ]/g, "")}-values-report.pdf`,
          content: pdfBuffer.toString("base64"),
        },
      ],
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, messageId: data?.id })
  } catch (error) {
    console.error("Failed to send email report:", error)
    return NextResponse.json({ error: "Failed to send email. Please try again." }, { status: 500 })
  }
}
