"use server"

import { createClient } from "@/lib/supabase/server"
import { nanoid } from "nanoid"
import type { Session, SessionValue, ValueMaster } from "@/lib/types"

export async function createSession(): Promise<Session> {
  const supabase = await createClient()

  // Create a new session
  const { data: session, error: sessionError } = await supabase.from("sessions").insert({}).select().single()

  if (sessionError || !session) {
    console.error("[v0] Session creation error:", sessionError)
    throw new Error("Failed to create session")
  }

  // Get all default values
  const { data: values, error: valuesError } = await supabase.from("values_master").select("*").eq("is_default", true)

  if (valuesError || !values) {
    console.error("[v0] Values fetch error:", valuesError)
    throw new Error("Failed to fetch values")
  }

  const sessionValues = values.map((value: ValueMaster) => ({
    session_id: session.id,
    value_master_id: value.id,
    priority: "unsorted",
    is_core: false,
  }))

  const { error: insertError } = await supabase.from("session_values").insert(sessionValues)

  if (insertError) {
    console.error("[v0] Session values insert error:", insertError)
    throw new Error("Failed to initialize session values")
  }

  return session as Session
}

export async function getSession(sessionId: string): Promise<Session | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("sessions").select("*").eq("id", sessionId).single()

  if (error || !data) {
    return null
  }

  return data as Session
}

export async function getSessionValues(sessionId: string): Promise<SessionValue[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("session_values")
    .select(`
      *,
      values_master (*)
    `)
    .eq("session_id", sessionId)

  if (error || !data) {
    return []
  }

  return data as SessionValue[]
}

export async function updateValuePriority(
  sessionValueId: string,
  priority: "unsorted" | "low" | "medium" | "high",
): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("session_values")
    .update({
      priority: priority,
      updated_at: new Date().toISOString(),
    })
    .eq("id", sessionValueId)

  if (error) {
    throw new Error("Failed to update value priority")
  }
}

export async function updateCoreValue(
  sessionValueId: string,
  isCore: boolean,
  customDescription?: string,
): Promise<void> {
  const supabase = await createClient()

  const updateData: Record<string, unknown> = {
    is_core: isCore,
    updated_at: new Date().toISOString(),
  }

  if (customDescription !== undefined) {
    updateData.custom_description = customDescription
  }

  const { error } = await supabase.from("session_values").update(updateData).eq("id", sessionValueId)

  if (error) {
    throw new Error("Failed to update core value")
  }
}

export async function addCustomValue(sessionId: string, label: string, description?: string): Promise<SessionValue> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("session_values")
    .insert({
      session_id: sessionId,
      custom_label: label,
      custom_description: description || null,
      priority: "high",
      is_core: false,
    })
    .select()
    .single()

  if (error || !data) {
    throw new Error("Failed to add custom value")
  }

  return data as SessionValue
}

export async function finalizeSession(
  sessionId: string,
  userName: string | null,
  userEmail?: string,
): Promise<Session> {
  const supabase = await createClient()

  const { data: existingSession, error: fetchError } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", sessionId)
    .single()

  if (fetchError) {
    console.error("[v0] Error fetching session:", fetchError)
    throw new Error("Failed to fetch session")
  }

  // If already finalized, just return the existing session
  if (existingSession?.slug) {
    console.log("[v0] Session already finalized with slug:", existingSession.slug)
    return existingSession as Session
  }

  const shareSlug = nanoid(10)

  const updateData: Record<string, unknown> = {
    user_name: userName,
    slug: shareSlug,
    completed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  // Only include email if provided
  if (userEmail) {
    updateData.user_email = userEmail
  }

  const { data, error } = await supabase.from("sessions").update(updateData).eq("id", sessionId).select().single()

  if (error) {
    console.error("[v0] Error updating session:", error)
    throw new Error("Failed to finalize session")
  }

  if (!data) {
    console.error("[v0] No data returned from update")
    throw new Error("Failed to finalize session - no data returned")
  }

  console.log("[v0] Session finalized successfully:", data)
  return data as Session
}

export async function getSessionBySlug(slug: string): Promise<Session | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("sessions").select("*").eq("slug", slug).single()

  if (error || !data) {
    return null
  }

  return data as Session
}

export async function getSessionValuesBySlug(slug: string): Promise<SessionValue[]> {
  const supabase = await createClient()

  const { data: session, error: sessionError } = await supabase.from("sessions").select("id").eq("slug", slug).single()

  if (sessionError || !session) {
    return []
  }

  const { data, error } = await supabase
    .from("session_values")
    .select(`
      *,
      values_master (*)
    `)
    .eq("session_id", session.id)

  if (error || !data) {
    return []
  }

  return data as SessionValue[]
}

export async function saveReflectionResponses(slug: string, responses: Record<string, string>): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("sessions")
    .update({
      reflection_responses: responses,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", slug)

  if (error) {
    throw new Error("Failed to save reflection responses")
  }
}

export async function getReflectionResponses(slug: string): Promise<Record<string, string> | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("sessions").select("reflection_responses").eq("slug", slug).single()

  if (error || !data) {
    return null
  }

  return data.reflection_responses as Record<string, string> | null
}
