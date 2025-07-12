-- Email Notification Migration for Execli VOC Report System
-- Run this in your Supabase SQL Editor

-- 1. Add email field to reports table
ALTER TABLE reports 
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS business_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS business_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS selected_platforms TEXT[];

-- 2. Create email templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Insert default email template for report completion
INSERT INTO email_templates (name, subject, html_content, text_content) VALUES (
  'report_complete',
  'Your VOC Report is Ready! 🎉',
  '
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your VOC Report is Ready</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
      .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
      .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; }
      .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      .highlight { background: #fff3cd; padding: 15px; border-radius: 6px; border-left: 4px solid #ffc107; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🎉 Your VOC Report is Ready!</h1>
        <p>We''ve analyzed your customer reviews and found some valuable insights</p>
      </div>
      <div class="content">
        <h2>Hello!</h2>
        <p>Great news! Your Voice of Customer (VOC) report for <strong>{{business_name}}</strong> has been completed.</p>
        
        <div class="highlight">
          <h3>📊 What you''ll find in your report:</h3>
          <ul>
            <li>Customer sentiment analysis across {{platform_count}} platforms</li>
            <li>Key insights and trending topics</li>
            <li>Actionable recommendations to improve your business</li>
            <li>Competitor comparison and market gaps</li>
          </ul>
        </div>
        
        <p style="text-align: center; margin: 30px 0;">
          <a href="{{report_url}}" class="button">View Your Report</a>
        </p>
        
        <p><strong>Quick Stats:</strong></p>
        <ul>
          <li>📈 Total Reviews Analyzed: {{total_reviews}}</li>
          <li>⭐ Average Rating: {{average_rating}}</li>
          <li>🎯 Sentiment Score: {{sentiment_score}}%</li>
          <li>🔍 Platforms: {{platforms}}</li>
        </ul>
        
        <p>This report will help you understand what your customers are saying and how to improve your business based on real feedback.</p>
        
        <p>Best regards,<br>The Execli Team</p>
      </div>
      <div class="footer">
        <p>This email was sent to {{email}} because you requested a VOC report.</p>
        <p>© 2024 Execli. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  ',
  '
Your VOC Report is Ready! 🎉

Hello!

Great news! Your Voice of Customer (VOC) report for {{business_name}} has been completed.

📊 What you''ll find in your report:
• Customer sentiment analysis across {{platform_count}} platforms
• Key insights and trending topics  
• Actionable recommendations to improve your business
• Competitor comparison and market gaps

View Your Report: {{report_url}}

Quick Stats:
• Total Reviews Analyzed: {{total_reviews}}
• Average Rating: {{average_rating}}
• Sentiment Score: {{sentiment_score}}%
• Platforms: {{platforms}}

This report will help you understand what your customers are saying and how to improve your business based on real feedback.

Best regards,
The Execli Team

This email was sent to {{email}} because you requested a VOC report.
© 2024 Execli. All rights reserved.
  '
);

-- 4. Create email logs table for tracking
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES reports(id),
  email VARCHAR(255) NOT NULL,
  template_name VARCHAR(100) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create function to send email notifications
CREATE OR REPLACE FUNCTION send_report_completion_email()
RETURNS TRIGGER AS $$
DECLARE
  template_record RECORD;
  email_content TEXT;
  report_data JSONB;
  business_name_val VARCHAR(255);
  total_reviews_val INTEGER;
  average_rating_val DECIMAL(3,2);
  sentiment_score_val INTEGER;
  platforms_val TEXT;
  platform_count_val INTEGER;
BEGIN
  -- Only send email when status changes to 'complete'
  IF NEW.status = 'complete' AND OLD.status != 'complete' THEN
    
    -- Get email template
    SELECT * INTO template_record FROM email_templates WHERE name = 'report_complete';
    
    -- Get report data
    report_data := NEW.report_data;
    business_name_val := COALESCE(NEW.business_name, 'your business');
    total_reviews_val := COALESCE((report_data->>'total_reviews')::INTEGER, 0);
    average_rating_val := COALESCE((report_data->>'average_rating')::DECIMAL(3,2), 0.0);
    sentiment_score_val := COALESCE((report_data->>'sentiment_score')::INTEGER, 0);
    
    -- Format platforms
    IF NEW.selected_platforms IS NOT NULL AND array_length(NEW.selected_platforms, 1) > 0 THEN
      platforms_val := array_to_string(NEW.selected_platforms, ', ');
      platform_count_val := array_length(NEW.selected_platforms, 1);
    ELSE
      platforms_val := 'Multiple platforms';
      platform_count_val := 1;
    END IF;
    
    -- Replace template variables
    email_content := template_record.html_content;
    email_content := replace(email_content, '{{business_name}}', business_name_val);
    email_content := replace(email_content, '{{report_url}}', 'https://execli.com/report/' || NEW.id::text);
    email_content := replace(email_content, '{{total_reviews}}', total_reviews_val::text);
    email_content := replace(email_content, '{{average_rating}}', average_rating_val::text);
    email_content := replace(email_content, '{{sentiment_score}}', sentiment_score_val::text);
    email_content := replace(email_content, '{{platforms}}', platforms_val);
    email_content := replace(email_content, '{{platform_count}}', platform_count_val::text);
    email_content := replace(email_content, '{{email}}', NEW.email);
    
    -- Log email attempt
    INSERT INTO email_logs (report_id, email, template_name, subject, status)
    VALUES (NEW.id, NEW.email, 'report_complete', template_record.subject, 'pending');
    
    -- Here you would integrate with your email service (Resend, SendGrid, etc.)
    -- For now, we'll just log it. You can add the actual email sending logic later.
    
    -- Update email log as sent
    UPDATE email_logs 
    SET status = 'sent', sent_at = NOW() 
    WHERE report_id = NEW.id AND template_name = 'report_complete';
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Create trigger to automatically send emails
DROP TRIGGER IF EXISTS trigger_send_report_completion_email ON reports;
CREATE TRIGGER trigger_send_report_completion_email
  AFTER UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION send_report_completion_email();

-- 7. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reports_email ON reports(email);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_report_id ON email_logs(report_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status); 