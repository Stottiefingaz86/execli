# Execli - Voice of Customer Analytics Platform

A comprehensive Voice of Customer (VOC) analytics platform that automatically detects, scrapes, and analyzes customer reviews across multiple platforms to provide actionable insights.

## 🚀 Features

### Core Functionality
- **Multi-Platform Review Detection**: Automatically finds reviews on Google, Yelp, Trustpilot, TripAdvisor, and more
- **AI-Powered Analysis**: Uses OpenAI to analyze sentiment, extract insights, and identify trends
- **Real-Time Polling**: Background processing with live status updates
- **Email Notifications**: Automatic email delivery when reports are ready
- **Shareable Reports**: Generate shareable links for team collaboration

### User Experience
- **Free Tier**: 1 review source, basic insights
- **Paid Tier**: Multiple sources, weekly sync, advanced analytics
- **Interactive Dashboard**: Beautiful, responsive UI with real-time updates
- **Progress Tracking**: Visual progress indicators during processing

### Technical Features
- **Next.js 14**: Modern React framework with App Router
- **Supabase**: Database, authentication, and real-time features
- **Puppeteer**: Web scraping for review platforms
- **TypeScript**: Full type safety
- **Tailwind CSS**: Modern, responsive styling

## 📋 System Flow

1. **User Input**: Brand name, URL, email
2. **Platform Detection**: Scraper finds available review sources
3. **Report Creation**: VOC report created with detected sources
4. **Background Processing**: AI analysis runs in background
5. **Polling**: Frontend polls for completion status
6. **Email Notification**: User receives email with shareable link
7. **Interactive Report**: User can add more sources and sync data

## 🛠️ Setup Instructions

### 1. Clone and Install
```bash
git clone <repository-url>
cd execli
npm install
```

### 2. Environment Configuration
Copy `env.example` to `.env.local` and fill in your values:

```bash
cp env.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
- `RESEND_API_KEY`: Email service API key (optional for development)
- `OPENAI_API_KEY`: OpenAI API key for AI analysis

### 3. Database Setup
Run the database migration in your Supabase SQL Editor:

```sql
-- Copy and paste the contents of supabase-migration.sql
```

### 4. Email Service Setup (Optional)
For email notifications, set up Resend:

1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Add to `.env.local`: `RESEND_API_KEY=your_key_here`

### 5. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🎯 Usage Guide

### Creating a Report
1. Enter your brand name
2. Add your website URL (optional)
3. Provide your email address
4. Click "Generate Free Report"
5. Wait for platform detection and analysis
6. Receive email notification when complete

### Using the Report Dashboard
- **Voice of Customer Overview**: High-level metrics and insights
- **Review Sources**: Add and manage review platforms
- **Key Insights**: AI-generated insights from customer feedback
- **Trending Topics**: Topics gaining or losing traction
- **Weekly Sync**: For paid users, automatically sync new reviews

### Plan Limits
- **Free**: 1 review source, basic insights
- **Paid**: Multiple sources, weekly sync, advanced analytics

## 🔧 API Endpoints

### Core APIs
- `POST /api/scrape`: Create new VOC report
- `GET /api/report-status`: Check report processing status
- `POST /api/add-source`: Add review source to existing report
- `POST /api/send-email`: Send email notifications
- `POST /api/weekly-sync`: Weekly sync for paid users

### Report Pages
- `/report/[id]`: Individual report page with polling
- `/reports`: List of all reports (future feature)

## 🏗️ Architecture

### Frontend
- **Next.js 14**: App Router, Server Components
- **React Hooks**: State management and effects
- **Tailwind CSS**: Utility-first styling
- **Lucide Icons**: Beautiful icon library

### Backend
- **Supabase**: Database, authentication, real-time
- **Puppeteer**: Web scraping engine
- **OpenAI**: AI analysis and insights
- **Resend**: Email delivery service

### Database Schema
- `companies`: Business information
- `voc_reports`: Main report data
- `reviews`: Individual review data
- `email_logs`: Email delivery tracking

## 🧪 Testing

### Local Testing
1. Start the development server
2. Submit a test report
3. Check console logs for processing
4. Verify email delivery (if configured)

### API Testing
```bash
# Test report creation
curl -X POST http://localhost:3000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"business_name":"Test Business","business_url":"https://example.com","email":"test@example.com"}'

# Test report status
curl http://localhost:3000/api/report-status?report_id=your_report_id
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Environment Variables for Production
- Set all required environment variables
- Use production Supabase project
- Configure email service for production

## 🔍 Monitoring

### Development
- Check browser console for errors
- Monitor Supabase dashboard
- Review email logs (if configured)

### Production
- Set up error monitoring (Sentry, etc.)
- Monitor email delivery rates
- Track report generation success rates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the setup guides
- Open an issue on GitHub

---

**Built with ❤️ using Next.js, Supabase, and OpenAI**