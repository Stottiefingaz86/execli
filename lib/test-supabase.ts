// Test Supabase connection and tables
import { supabase } from './supabase'

async function testSupabase() {
  console.log('Testing Supabase connection...')
  
  try {
    // Test 1: Check if we can connect
    const { data, error } = await supabase()
      .from('companies')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('❌ Supabase connection error:', error)
      return false
    }
    
    console.log('✅ Supabase connection successful')
    console.log('📋 Companies table columns:', Object.keys(data?.[0] || {}))
    
    // Test 2: Try to insert a test company (without industry field)
    const { data: insertData, error: insertError } = await supabase()
      .from('companies')
      .insert({
        name: 'Test Company',
        url: 'https://testcompany.com',
        status: 'processing'
      })
      .select()
      .single()
    
    if (insertError) {
      console.log('❌ Insert error:', insertError)
      return false
    }
    
    console.log('✅ Insert successful, company ID:', insertData.id)
    
    // Test 3: Clean up - delete the test company
    const { error: deleteError } = await supabase()
      .from('companies')
      .delete()
      .eq('id', insertData.id)
    
    if (deleteError) {
      console.log('⚠️  Cleanup error (not critical):', deleteError)
    } else {
      console.log('✅ Cleanup successful')
    }
    
    return true
    
  } catch (error) {
    console.log('❌ Test failed:', error)
    return false
  }
}

// Run test if called directly
if (require.main === module) {
  testSupabase().then(success => {
    if (success) {
      console.log('🎉 Supabase test passed!')
    } else {
      console.log('💥 Supabase test failed!')
    }
  })
}

export { testSupabase } 