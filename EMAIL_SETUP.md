# Email Notification Setup Guide

This guide will help you set up email notifications for when VOC reports are completed.

## 🚀 Quick Setup

### 1. Run Database Migration

First, run the email migration in your Supabase SQL Editor:

```sql
-- Copy and paste the contents of supabase-migration-email.sql
-- This will create the necessary tables and triggers
```

### 2. Deploy Supabase Edge Function

Deploy the email function to Supabase:

```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy the function
supabase functions deploy send-email
```

### 3. Set Up Email Service

Choose one of the following email services:

#### Option A: Resend (Recommended)
1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Add to Supabase secrets:
```bash
supabase secrets set RESEND_API_KEY=your_api_key_here
```

#### Option B: SendGrid
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Get your API key
3. Add to Supabase secrets:
```bash
supabase secrets set SENDGRID_API_KEY=your_api_key_here
```

### 4. Configure Environment Variables

Add these to your `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email Service (choose one)
RESEND_API_KEY=your_resend_api_key
# OR
SENDGRID_API_KEY=your_sendgrid_api_key
```

## 📧 Email Templates

The system includes a beautiful HTML email template with:

- ✅ Responsive design
- ✅ Branded styling
- ✅ Dynamic content (business name, stats, etc.)
- ✅ Call-to-action button
- ✅ Plain text fallback

### Template Variables

The email template supports these variables:

- `{{business_name}}` - The business name
- `{{report_url}}` - Direct link to the report
- `{{total_reviews}}` - Number of reviews analyzed
- `{{average_rating}}` - Average rating
- `{{sentiment_score}}` - Sentiment percentage
- `{{platforms}}` - Platforms analyzed
- `{{platform_count}}` - Number of platforms
- `{{email}}` - User's email address

## 🔄 How It Works

### Automatic Flow:
1. User submits form → Platform detection
2. User selects platforms → Report generation starts
3. Report completes → Database trigger fires
4. Edge function sends email → User gets notified

### Manual Testing:
You can manually trigger emails for testing:

```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"report_id": "your_report_id"}'
```

## 📊 Email Tracking

The system includes comprehensive email tracking:

- **Email Logs Table**: Tracks all email attempts
- **Status Tracking**: pending → sent/failed
- **Error Logging**: Captures and logs any email errors
- **Delivery Confirmation**: Updates status when email is sent

## 🛠️ Customization

### Modify Email Template

Edit the template in the database:

```sql
UPDATE email_templates 
SET html_content = 'your_new_html',
    text_content = 'your_new_text'
WHERE name = 'report_complete';
```

### Add New Templates

```sql
INSERT INTO email_templates (name, subject, html_content, text_content) 
VALUES ('welcome', 'Welcome to Execli!', 'html_content', 'text_content');
```

### Custom Email Service

To use a different email service, modify the `sendEmail` function in `supabase/functions/send-email/index.ts`.

## 🧪 Testing

### Test Email Function

```bash
# Test the edge function directly
curl -X POST https://your-project.supabase.co/functions/v1/send-email \
  -H "Authorization: Bearer your_anon_key" \
  -H "Content-Type: application/json" \
  -d '{"report_id": "test_report_id"}'
```

### Test Complete Flow

1. Submit a report through the UI
2. Wait for completion (5 seconds in development)
3. Check email logs in Supabase dashboard
4. Verify email was sent

## 🔍 Monitoring

### Check Email Logs

```sql
-- View all email attempts
SELECT * FROM email_logs ORDER BY created_at DESC;

-- Check failed emails
SELECT * FROM email_logs WHERE status = 'failed';

-- Email success rate
SELECT 
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM email_logs 
GROUP BY status;
```

### Supabase Dashboard

- Go to your Supabase dashboard
- Navigate to Database → Tables → email_logs
- Monitor email delivery status

## 🚨 Troubleshooting

### Common Issues:

1. **Email not sending**: Check API keys and service configuration
2. **Template not found**: Ensure email_templates table has data
3. **Edge function errors**: Check Supabase function logs
4. **Database trigger not firing**: Verify trigger is created correctly

### Debug Steps:

1. Check Supabase function logs:
```bash
supabase functions logs send-email
```

2. Verify database trigger:
```sql
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'trigger_send_report_completion_email';
```

3. Test email service directly:
```bash
# Test Resend
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer your_resend_key" \
  -H "Content-Type: application/json" \
  -d '{"from":"test@execli.com","to":["test@example.com"],"subject":"Test","html":"<p>Test</p>"}'
```

## 📈 Production Considerations

### Rate Limiting
- Resend: 100 emails/day (free), 50,000/month (paid)
- SendGrid: 100 emails/day (free), unlimited (paid)

### Domain Verification
- Verify your domain with your email service
- Update from address to use your domain

### Monitoring
- Set up alerts for failed emails
- Monitor delivery rates
- Track email engagement

## 🎯 Next Steps

1. **Set up email service** (Resend recommended)
2. **Deploy edge function** to Supabase
3. **Test the complete flow**
4. **Monitor email delivery**
5. **Customize templates** as needed

The email system is now ready to automatically notify users when their VOC reports are complete! 🎉 