# Setup Guide for Custom Scraper System

## 🚀 Quick Start (5 minutes)

### Step 1: Get AI API Key

**Option A: OpenAI (Recommended)**
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up/login and go to API Keys
3. Create new API key
4. Copy the key

**Option B: Anthropic**
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up/login and go to API Keys
3. Create new API key
4. Copy the key

### Step 2: Set Up Supabase Database

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings > API
4. Copy these values:
   - Project URL
   - Anon public key
   - Service role key (keep secret!)

### Step 3: Create Environment File

Create `.env.local` in your project root:

```env
# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# AI Service (choose ONE)
OPENAI_API_KEY=your_openai_api_key_here
# OR
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development
```

### Step 4: Run Database Migration

1. Go to your Supabase dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `supabase-migration.sql`
4. Click "Run" to create all tables

### Step 5: Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000` and test the scraper!

## 💰 Cost Breakdown

### Monthly Costs (Fixed)
- **Vercel Pro**: $20/month (unlimited requests)
- **Supabase**: $0/month (free tier)
- **Total Fixed**: $20/month

### Pay-Per-Use Costs
- **AI Analysis**: ~$0.01-0.10 per analysis
- **Example**: 1000 analyses = $10-100/month

### Total Monthly Cost
- **Low usage** (100 analyses): ~$30/month
- **High usage** (1000 analyses): ~$120/month
- **Unlimited usage**: ~$20 + AI costs

## 🔧 Troubleshooting

### "Puppeteer not working"
- Make sure you're using Vercel Pro (required for Puppeteer)
- Check that `--no-sandbox` flags are in scraper config

### "AI analysis failing"
- Verify your API key is correct
- Check your API quota/credits
- Test with a smaller dataset first

### "Database connection error"
- Verify Supabase credentials
- Check that migration was run successfully
- Ensure RLS policies are set up

## 🚀 Deploy to Production

### 1. Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### 2. Add Environment Variables
In Vercel dashboard:
1. Go to your project
2. Settings > Environment Variables
3. Add all variables from `.env.local`

### 3. Upgrade to Vercel Pro
- Required for Puppeteer
- $20/month for unlimited usage

### 4. Test Production
Visit your deployed URL and test the scraper!

## 📊 Cost Comparison

| Service | Pipedream | Custom System |
|---------|-----------|---------------|
| **10K requests/month** | $19 | $20 + AI costs |
| **100K requests/month** | $99 | $20 + AI costs |
| **1M requests/month** | $999 | $20 + AI costs |

**Savings**: 70-98% cost reduction for high volume!

## 🎯 Next Steps

1. **Test with real URLs** to verify scraping works
2. **Add more platforms** by updating `SCRAPER_CONFIGS`
3. **Customize AI prompts** in `lib/llm-prompts.ts`
4. **Add monitoring** for production use
5. **Scale with Redis** if needed for high volume

The system is now ready to use! The key advantage is that you pay fixed costs regardless of volume, making it much cheaper for high-usage scenarios. 