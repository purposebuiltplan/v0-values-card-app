export interface ValueMaster {
  id: string
  label: string
  description: string | null
  is_default: boolean
}

export interface Session {
  id: string
  created_at: string
  updated_at: string
  slug: string | null
  user_name: string | null
  user_email: string | null
  current_step: number
  completed_at: string | null
  reflection_responses: Record<string, string> | null
}

export interface SessionValue {
  id: string
  session_id: string
  value_master_id: string | null
  custom_label: string | null
  custom_description: string | null
  priority: "unsorted" | "low" | "medium" | "high"
  is_core: boolean
  sort_order: number
  created_at: string
  updated_at: string
  // Joined from values_master
  values_master?: ValueMaster
}

export type Priority = "unsorted" | "low" | "medium" | "high"

export interface ValueCard {
  id: string
  sessionValueId: string
  label: string
  description: string | null
  priority: Priority
  isCore: boolean
  customDescription: string | null
  isCustom: boolean
}
