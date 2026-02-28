import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

// Simple Supabase client for cron job (no cookies needed)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    // Simple query to keep the database active
    const { count, error } = await supabase
      .from("sessions")
      .select("*", { count: "exact", head: true })

    if (error) {
      console.error("Keep-alive ping failed:", error.message)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    console.log(`Keep-alive ping successful. Sessions count: ${count}`)
    return NextResponse.json({
      success: true,
      message: "Database is active",
      sessionsCount: count,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error("Keep-alive error:", err)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
