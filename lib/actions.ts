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

export async function finalizeSession(sessionId: string, userName: string | null, userEmail: string): Promise<Session> {
  const supabase = await createClient()

  const shareSlug = nanoid(10)

  const { data, error } = await supabase
    .from("sessions")
    .update({
      user_name: userName,
      user_email: userEmail,
      slug: shareSlug,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", sessionId)
    .select()
    .single()

  if (error || !data) {
    throw new Error("Failed to finalize session")
  }

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
