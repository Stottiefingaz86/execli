// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

console.log("Hello from Functions!")

serve(async (req) => {
  try {
    const { report_id, company_id, business_name, business_url, email } = await req.json();
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Helper to update report progress
    async function updateProgress(message: string, status: string = 'processing') {
      await supabase.from('voc_reports').update({ progress_message: message, status }).eq('id', report_id);
    }

    // 1. Initializing (already set by API route)
    await updateProgress('Initializing report...');

    // 2. Scraping sources (Trustpilot, Google, Yelp, Reddit, TripAdvisor)
    const platforms = [
      { name: 'Trustpilot', url: `https://www.trustpilot.com/review/${business_url}` },
      { name: 'Google', url: `https://www.google.com/search?q=${encodeURIComponent(business_name + ' reviews')}` },
      { name: 'Yelp', url: `https://www.yelp.com/search?find_desc=${encodeURIComponent(business_name)}` },
      { name: 'Reddit', url: `https://www.reddit.com/search/?q=${encodeURIComponent(business_name + ' review')}` },
      { name: 'TripAdvisor', url: `https://www.tripadvisor.com/Search?q=${encodeURIComponent(business_name)}` }
    ];
    let allReviews: any[] = [];
    for (let i = 0; i < platforms.length; i++) {
      const p = platforms[i];
      await updateProgress(`Scraping ${p.name}... (${i + 1}/${platforms.length})`);
      // Simulate scraping (replace with real scraping logic or call your own API)
      try {
        // TODO: Replace with real scraping logic
        await new Promise((res) => setTimeout(res, 1000));
        // Example: const reviews = await scrapePlatform(p.url);
        const reviews = [{ platform: p.name, text: `Sample review from ${p.name}` }];
        allReviews = allReviews.concat(reviews);
      } catch (err) {
        await updateProgress(`Error scraping ${p.name}: ${err.message || err}`, 'error');
      }
    }

    // 3. Analyzing customer feedback
    await updateProgress('Analyzing customer feedback...');
    // Simulate analysis (replace with real AI/ML logic)
    await new Promise((res) => setTimeout(res, 1500));
    // Example: const analysis = await analyzeReviews(allReviews);
    const analysis = { summary: 'Sample analysis', industry: 'Sample industry' };

    // 4. Generating insights and charts
    await updateProgress('Generating insights and charts...');
    await new Promise((res) => setTimeout(res, 1000));
    // Example: const insights = await generateInsights(analysis);
    const insights = { chart: 'Sample chart' };

    // 5. Sending email notification
    await updateProgress('Sending email notification...');
    await new Promise((res) => setTimeout(res, 500));
    // TODO: Send email to user (email)

    // 6. Report ready
    await updateProgress('Report ready!', 'complete');

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/process-voc-report' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
