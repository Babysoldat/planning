import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://dbxbvcukrhcknjtbwflf.supabase.co'
const SUPABASE_KEY = 'sb_publishable_YGDkptcHRRTTzLfbHGzuYg_Ixtwwipr'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function loadPlanning(key) {
  const { data, error } = await supabase
    .from('planning')
    .select('data')
    .eq('id', key)
    .single()
  if (error || !data) return null
  return data.data
}

export async function savePlanning(key, value) {
  const { error } = await supabase
    .from('planning')
    .upsert({ id: key, data: value, updated_at: new Date().toISOString() })
  if (error) console.error('Save error:', error)
}
