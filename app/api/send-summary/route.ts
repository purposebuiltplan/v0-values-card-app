import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, name, shareUrl, coreValues, otherImportantValues } = await request.json()

    const coreValuesHtml = coreValues
      .map(
        (v: { label: string; description?: string }) =>
          `<li style="margin-bottom: 12px;"><strong>${v.label}</strong>${v.description ? `<br/><span style="color: #666;">${v.description}</span>` : ""}</li>`,
      )
      .join("")

    const otherValuesHtml =
      otherImportantValues?.length > 0
        ? `<p style="margin-top: 24px;"><strong>Other values that matter to you:</strong><br/>${otherImportantValues.map((v: { label: string }) => v.label).join(", ")}</p>`
        : ""

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h1 style="color: #1a1a1a; font-size: 24px;">Hi ${name || "there"},</h1>
        
        <p style="color: #444; font-size: 16px; line-height: 1.6;">
          Thank you for completing the Purpose Built Values exercise! Here are the core values you identified:
        </p>
        
        <ul style="color: #333; font-size: 16px; line-height: 1.6; padding-left: 20px;">
          ${coreValuesHtml}
        </ul>
        
        ${otherValuesHtml}
        
        <p style="margin-top: 32px;">
          <a href="${shareUrl}" style="background-color: #4a5568; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Your Full Summary
          </a>
        </p>
        
        <p style="color: #666; font-size: 14px; margin-top: 32px;">
          Save this email to revisit your values anytime, or share your summary page with others.
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
        
        <p style="color: #999; font-size: 12px;">
          Purpose Built Values Exercise
        </p>
      </div>
    `

    const { data, error } = await resend.emails.send({
      from: "Purpose Built <onboarding@resend.dev>",
      to: email,
      subject: `${name ? name + ", your" : "Your"} Core Values Summary is ready`,
      html,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, messageId: data?.id })
  } catch (error) {
    console.error("Failed to send email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
