import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get all active reports that need syncing
    const { data: reports } = await supabase
      .from('voc_reports')
      .select('id, company_id, business_name, business_url, sources, detected_sources')
      .eq('status', 'completed')
      .gte('processed_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()); // Reports from last 7 days

    if (!reports || reports.length === 0) {
      return new Response(JSON.stringify({ message: 'No reports to sync' }));
    }

    console.log(`Found ${reports.length} reports to sync`);

    const results = [];

    // Sync each report
    for (const report of reports) {
      try {
        console.log(`Syncing report ${report.id} for ${report.business_name}`);
        
        // Call the sync function for this report
        const syncResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/sync-voc-report`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            report_id: report.id,
            company_id: report.company_id,
            business_name: report.business_name,
            business_url: report.business_url
          })
        });

        if (syncResponse.ok) {
          const result = await syncResponse.json();
          results.push({
            report_id: report.id,
            business_name: report.business_name,
            success: true,
            ...result
          });
        } else {
          const error = await syncResponse.text();
          results.push({
            report_id: report.id,
            business_name: report.business_name,
            success: false,
            error
          });
        }
      } catch (error) {
        console.error(`Error syncing report ${report.id}:`, error);
        results.push({
          report_id: report.id,
          business_name: report.business_name,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    console.log('Scheduled sync completed:', results);
    return new Response(JSON.stringify({ 
      success: true, 
      message: `Scheduled sync completed for ${reports.length} reports`,
      results 
    }));

  } catch (error) {
    console.error('Error in scheduled sync:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), { status: 500 });
  }
}); 