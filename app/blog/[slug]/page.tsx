import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, FileText } from 'lucide-react';

// Blog posts data - this should ideally come from a CMS or database
const BLOG_POSTS = [
  {
    id: 1,
    title: "How to Grow Your Ratings and Get Noticed",
    excerpt: "Proven strategies to increase your business ratings, attract more customers, and stand out in a crowded market.",
    content: `
      <h2>Understanding the Power of Ratings</h2>
      <p>In today's digital-first world, your online ratings can make or break your business. Studies show that 93% of consumers read online reviews before making a purchase, and businesses with higher ratings see up to 18% more revenue.</p>
      
      <h3>Why Ratings Matter</h3>
      <p>Your ratings serve as social proof, influencing potential customers' decisions before they even interact with your business. They appear in search results, on your website, and across review platforms, creating a first impression that's hard to change.</p>
      
      <h2>Proven Strategies to Boost Your Ratings</h2>
      
      <h3>1. Deliver Exceptional Customer Experience</h3>
      <p>The foundation of great ratings is exceptional service. Focus on:</p>
      <ul>
        <li>Personalized interactions</li>
        <li>Quick response times</li>
        <li>Going above and beyond expectations</li>
        <li>Consistent quality across all touchpoints</li>
      </ul>
      
      <h3>2. Proactively Request Reviews</h3>
      <p>Don't wait for customers to leave reviews on their own. Implement a systematic approach:</p>
      <ul>
        <li>Ask for reviews at the right moment (after a positive interaction)</li>
        <li>Make it easy with direct links to review platforms</li>
        <li>Follow up with gentle reminders</li>
        <li>Thank customers who leave reviews</li>
      </ul>
      
      <h3>3. Monitor and Respond to All Reviews</h3>
      <p>Active engagement shows you care about customer feedback:</p>
      <ul>
        <li>Respond to both positive and negative reviews</li>
        <li>Address concerns promptly and professionally</li>
        <li>Use feedback to improve your business</li>
        <li>Show appreciation for positive feedback</li>
      </ul>
      
      <h2>Getting Noticed in a Crowded Market</h2>
      
      <h3>Optimize Your Online Presence</h3>
      <p>Ensure your business information is complete and accurate across all platforms:</p>
      <ul>
        <li>Complete your Google My Business profile</li>
        <li>Add high-quality photos</li>
        <li>Include relevant keywords in your descriptions</li>
        <li>Keep hours and contact information updated</li>
      </ul>
      
      <h3>Leverage Social Proof</h3>
      <p>Display your ratings prominently:</p>
      <ul>
        <li>Add review widgets to your website</li>
        <li>Share positive reviews on social media</li>
        <li>Include ratings in your marketing materials</li>
        <li>Create case studies from customer success stories</li>
      </ul>
      
      <h2>Measuring Success</h2>
      <p>Track your progress with key metrics:</p>
      <ul>
        <li>Average rating across platforms</li>
        <li>Number of reviews</li>
        <li>Response rate to reviews</li>
        <li>Impact on search rankings</li>
        <li>Customer acquisition from review platforms</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Growing your ratings and getting noticed requires a strategic, long-term approach. Focus on delivering exceptional experiences, actively managing your online presence, and consistently engaging with customer feedback. The results will follow.</p>
      
      <p>Remember, every interaction is an opportunity to earn a positive review and build your reputation in the market.</p>
    `,
    author: "Chris Hunt",
    date: "Dec 2, 2024",
    readTime: "6 min read",
    category: "Growth",
    slug: "how-to-grow-ratings"
  },
  {
    id: 2,
    title: "How to Reply to Negative Reviews (and Win Customers Back)",
    excerpt: "Turn criticism into opportunity: actionable tips for responding to negative feedback and building trust.",
    content: `
      <h2>The Reality of Negative Reviews</h2>
      <p>Every business receives negative reviews. It's not a matter of if, but when. How you respond can make the difference between losing a customer forever and turning a critic into a loyal advocate.</p>
      
      <h3>Why Negative Reviews Matter</h3>
      <p>Negative reviews can significantly impact your business:</p>
      <ul>
        <li>They affect your overall rating</li>
        <li>They influence potential customers' decisions</li>
        <li>They provide valuable feedback for improvement</li>
        <li>They offer opportunities to demonstrate excellent customer service</li>
      </ul>
      
      <h2>Best Practices for Responding to Negative Reviews</h2>
      
      <h3>1. Respond Quickly</h3>
      <p>Time is of the essence when dealing with negative feedback:</p>
      <ul>
        <li>Aim to respond within 24 hours</li>
        <li>Set up alerts for new reviews</li>
        <li>Have templates ready for common issues</li>
        <li>Don't let negative reviews sit unanswered</li>
      </ul>
      
      <h3>2. Stay Professional and Calm</h3>
      <p>Your response reflects on your entire business:</p>
      <ul>
        <li>Use a professional, courteous tone</li>
        <li>Avoid defensive or emotional language</li>
        <li>Don't take criticism personally</li>
        <li>Remember that your response is public</li>
      </ul>
      
      <h3>3. Acknowledge and Apologize</h3>
      <p>Show that you understand and care about their experience:</p>
      <ul>
        <li>Thank them for their feedback</li>
        <li>Acknowledge their concerns</li>
        <li>Offer a sincere apology</li>
        <li>Take responsibility when appropriate</li>
      </ul>
      
      <h3>4. Provide Specific Solutions</h3>
      <p>Don't just apologize—take action:</p>
      <ul>
        <li>Offer concrete solutions to their problem</li>
        <li>Provide contact information for further discussion</li>
        <li>Explain what you're doing to prevent future issues</li>
        <li>Follow up privately when possible</li>
      </ul>
      
      <h2>Winning Customers Back</h2>
      
      <h3>Turning Critics into Advocates</h3>
      <p>When handled properly, negative reviews can actually strengthen customer relationships:</p>
      <ul>
        <li>Demonstrate your commitment to customer satisfaction</li>
        <li>Show that you listen and take feedback seriously</li>
        <li>Prove your ability to handle problems professionally</li>
        <li>Create opportunities for customers to update their reviews</li>
      </ul>
      
      <h3>Follow-Up Strategies</h3>
      <p>Don't stop at the public response:</p>
      <ul>
        <li>Reach out privately to discuss the issue further</li>
        <li>Offer compensation or discounts when appropriate</li>
        <li>Invite them to try your service again</li>
        <li>Ask for feedback on the resolution</li>
      </ul>
      
      <h2>Preventing Future Negative Reviews</h2>
      <p>Use negative feedback as a learning opportunity:</p>
      <ul>
        <li>Identify patterns in complaints</li>
        <li>Implement process improvements</li>
        <li>Train staff on common issues</li>
        <li>Proactively address potential problems</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Negative reviews are inevitable, but they don't have to be damaging. With the right approach, you can turn criticism into opportunity, demonstrate excellent customer service, and potentially win back dissatisfied customers.</p>
      
      <p>Remember, every negative review is a chance to show the world how you handle challenges and care for your customers.</p>
    `,
    author: "Ava Lee",
    date: "Nov 28, 2024",
    readTime: "5 min read",
    category: "Reputation",
    slug: "reply-to-negative-reviews"
  },
  {
    id: 3,
    title: "Make VoC Reports Useful and Take Action",
    excerpt: "Unlock the real value of Voice of Customer reports by turning insights into business improvements.",
    content: `
      <h2>Understanding Voice of Customer (VoC) Reports</h2>
      <p>Voice of Customer reports are powerful tools that capture and analyze customer feedback, preferences, and experiences. However, many businesses collect this data but fail to translate it into actionable insights.</p>
      
      <h3>What Makes a VoC Report Valuable</h3>
      <p>Effective VoC reports should provide:</p>
      <ul>
        <li>Clear insights into customer needs and pain points</li>
        <li>Trends and patterns in customer feedback</li>
        <li>Actionable recommendations for improvement</li>
        <li>Metrics to track progress over time</li>
      </ul>
      
      <h2>From Data to Action: A Strategic Approach</h2>
      
      <h3>1. Identify Key Insights</h3>
      <p>Start by extracting the most important findings:</p>
      <ul>
        <li>Common pain points and complaints</li>
        <li>Positive experiences to amplify</li>
        <li>Unmet customer needs</li>
        <li>Competitive advantages and disadvantages</li>
      </ul>
      
      <h3>2. Prioritize Actions</h3>
      <p>Not all insights require immediate action. Prioritize based on:</p>
      <ul>
        <li>Impact on customer satisfaction</li>
        <li>Feasibility of implementation</li>
        <li>Resource requirements</li>
        <li>Strategic alignment</li>
      </ul>
      
      <h3>3. Create Action Plans</h3>
      <p>Transform insights into concrete plans:</p>
      <ul>
        <li>Set specific, measurable goals</li>
        <li>Assign responsibilities and timelines</li>
        <li>Define success metrics</li>
        <li>Establish review and feedback loops</li>
      </ul>
      
      <h2>Implementing VoC-Driven Improvements</h2>
      
      <h3>Product and Service Enhancements</h3>
      <p>Use customer feedback to guide development:</p>
      <ul>
        <li>Add features that address common pain points</li>
        <li>Improve existing products based on feedback</li>
        <li>Develop new services that meet unmet needs</li>
        <li>Optimize user experience based on customer preferences</li>
      </ul>
      
      <h3>Process Improvements</h3>
      <p>Streamline operations based on customer insights:</p>
      <ul>
        <li>Reduce friction in customer journeys</li>
        <li>Improve response times and communication</li>
        <li>Enhance training and support processes</li>
        <li>Optimize pricing and packaging strategies</li>
      </ul>
      
      <h2>Measuring the Impact of VoC Actions</h2>
      
      <h3>Key Metrics to Track</h3>
      <p>Monitor the success of your VoC-driven initiatives:</p>
      <ul>
        <li>Customer satisfaction scores</li>
        <li>Net Promoter Score (NPS)</li>
        <li>Customer retention rates</li>
        <li>Revenue per customer</li>
        <li>Reduction in support tickets</li>
      </ul>
      
      <h3>Continuous Improvement</h3>
      <p>Make VoC analysis an ongoing process:</p>
      <ul>
        <li>Regular review of customer feedback trends</li>
        <li>Periodic assessment of action plan effectiveness</li>
        <li>Adjustment of strategies based on results</li>
        <li>Integration of VoC insights into strategic planning</li>
      </ul>
      
      <h2>Building a VoC Culture</h2>
      <p>Success requires organization-wide commitment:</p>
      <ul>
        <li>Share insights across all departments</li>
        <li>Train teams on interpreting and acting on feedback</li>
        <li>Recognize and reward customer-centric improvements</li>
        <li>Make customer feedback part of decision-making processes</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>VoC reports are only as valuable as the actions they inspire. By systematically translating customer insights into strategic improvements, you can create a more customer-centric business that delivers better experiences and drives growth.</p>
      
      <p>Remember, the goal isn't just to collect feedback—it's to use that feedback to make meaningful changes that benefit your customers and your business.</p>
    `,
    author: "Jordan Smith",
    date: "Nov 25, 2024",
    readTime: "7 min read",
    category: "VoC",
    slug: "make-voc-reports-useful"
  }
];

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = BLOG_POSTS.find(p => p.slug === params.slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0f1117]/75 text-[#f3f4f6] font-sans relative overflow-x-hidden">
        <div className="max-w-4xl mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Article Not Found</h1>
            <p className="text-[#B0B0C0] mb-8">The article you're looking for doesn't exist.</p>
            <Link href="/blog" className="btn-secondary px-6 py-3 flex items-center gap-2 mx-auto w-fit">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1117]/75 text-[#f3f4f6] font-sans relative overflow-x-hidden">
      {/* Enhanced Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#0f1117]" />
        <div className="absolute inset-0 bg-gradient-radial" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[1200px] h-[900px] animate-gradient-shift blur-3xl" />
        <div className="absolute left-0 bottom-0 w-[500px] h-[400px] bg-gradient-to-tr from-[#232b4d]/40 to-[#86EFF5]/20 blur-2xl opacity-40" />
        <div className="absolute right-0 top-1/3 w-[400px] h-[300px] bg-gradient-to-bl from-[#3b82f6]/20 to-transparent blur-2xl opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-transparent" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full bg-[#1c1e26]/60 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 flex items-center h-16 justify-between">
          <div className="flex items-center">
            <Link href="/">
              <img src="/logo.svg" alt="Execli" className="h-7 w-auto py-1 cursor-pointer" />
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/blog" className="px-3 py-1.5 rounded-md btn-secondary text-sm flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
        </div>
      </nav>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 py-16 relative z-10">
        {/* Article Header */}
        <header className="mb-12">
          <div className="flex items-center space-x-4 text-sm mb-6">
            <span className="bg-[#3b82f6]/10 text-[#3b82f6] px-3 py-1 rounded-full">{post.category}</span>
            <div className="flex items-center space-x-1 text-[#B0B0C0]">
              <Calendar className="w-4 h-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center space-x-1 text-[#B0B0C0]">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>
          
          <p className="text-xl text-[#B0B0C0] mb-8 leading-relaxed">
            {post.excerpt}
          </p>
          
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {post.author.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <div className="text-white font-medium">{post.author}</div>
              <div className="text-[#B0B0C0] text-sm">Execli Team</div>
            </div>
          </div>
        </header>

        {/* Article Body */}
        <div className="bg-[#1c1e26]/40 border border-white/20 rounded-3xl shadow-2xl p-8 md:p-12 backdrop-blur-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01] rounded-3xl" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/5 via-transparent to-[#8b5cf6]/5 rounded-3xl" />
          
          <div className="relative z-10 prose prose-invert prose-lg max-w-none">
            <div 
              className="text-[#f3f4f6] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>

        {/* Article Footer */}
        <footer className="mt-12 text-center">
          <div className="bg-[#1c1e26]/40 border border-white/20 rounded-3xl shadow-2xl p-8 backdrop-blur-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01] rounded-3xl" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/5 via-transparent to-[#8b5cf6]/5 rounded-3xl" />
            
            <div className="relative z-10 space-y-6">
              <h3 className="text-2xl font-bold text-white">Ready to Turn Insights Into Action?</h3>
              <p className="text-[#B0B0C0] max-w-2xl mx-auto">
                Get your own Voice of Customer report and start making data-driven decisions for your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/" className="btn-primary px-8 py-3 text-lg font-semibold">
                  Generate Free Report
                </Link>
                <Link href="/blog" className="btn-secondary px-8 py-3 text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Read More Articles
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
} 