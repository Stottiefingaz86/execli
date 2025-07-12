import { createClient } from '@supabase/supabase-js'

export async function getCompany(companyId: string) {
  const supabaseUrl = process.env.SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single()

    if (error) {
      console.error('Error fetching company:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getCompany:', error)
    return null
  }
}

export async function getReport(reportId: string) {
  const supabaseUrl = process.env.SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    const { data, error } = await supabase
      .from('voc_reports')
      .select('*')
      .eq('id', reportId)
      .single()

    if (error) {
      console.error('Error fetching report:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getReport:', error)
    return null
  }
} 