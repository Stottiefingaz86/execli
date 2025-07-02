'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { CheckCircle, Mail, BarChart2, Users, Lock, Zap, FileText, TrendingUp, PieChart, Shield, Star, MessageCircle, UserCheck, ArrowRight, Wand2, Globe } from 'lucide-react';

const TRUST_LOGOS = [
  '/logos/stripe.svg',
  '/logos/notion.svg',
  '/logos/figma.svg',
  '/logos/linear.svg',
  '/logos/vercel.svg',
]

const NAV_LINKS = [
  { href: '#how-it-works', label: 'How it Works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '/report', label: 'Demo Report' },
  { href: '#', label: 'Resources', dropdown: [
    { href: '/blog', label: 'Blog' },
    { href: '#', label: 'Templates' },
    { href: '#', label: 'Strategy' },
  ]},
];

// Blog posts data
const BLOG_POSTS = [
  {
    id: 1,
    title: "How to Grow Your Ratings and Get Noticed",
    excerpt: "Proven strategies to increase your business ratings, attract more customers, and stand out in a crowded market.",
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
    author: "Jordan Smith",
    date: "Nov 25, 2024",
    readTime: "7 min read",
    category: "VoC",
    slug: "make-voc-reports-useful"
  }
];

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#1c1e26]/60 border border-white/10 rounded-2xl shadow-xl p-8 backdrop-blur-xl ${className} relative overflow-hidden`}>
      <div className="absolute inset-0 rounded-2xl pointer-events-none border border-white/5" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function AnimatedGraphPlaceholder() {
  return (
    <div className="w-full flex items-center justify-center">
      <svg width="220" height="100" viewBox="0 0 220 100" fill="none" className="drop-shadow-lg">
        <rect x="10" y="40" width="30" height="50" rx="4" fill="#3b82f6" className="animate-pulse" />
        <rect x="50" y="60" width="30" height="30" rx="4" fill="#8b5cf6" className="animate-pulse delay-100" />
        <rect x="90" y="30" width="30" height="70" rx="4" fill="#3b82f6" className="animate-pulse delay-200" />
        <rect x="130" y="55" width="30" height="45" rx="4" fill="#8b5cf6" className="animate-pulse delay-300" />
        <rect x="170" y="20" width="30" height="80" rx="4" fill="#3b82f6" className="animate-pulse delay-500" />
      </svg>
    </div>
  );
}

function StepIcon({ icon: Icon, ...props }: { icon: React.ComponentType<any>; [key: string]: any }) {
  return <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#3b82f6]/20 to-[#8b5cf6]/20 shadow-lg mb-3"><Icon size={24} className="text-[#3b82f6]" /></div>;
}

function HowItWorks() {
  const steps = [
    { icon: FileText, label: 'Paste business URL', desc: 'Just drop your site link.' },
    { icon: Users, label: 'Add competitor (optional)', desc: 'Benchmark against anyone.' },
    { icon: Mail, label: 'Submit email', desc: 'Get your report delivered.' },
    { icon: BarChart2, label: 'Get instant VOC report', desc: 'See insights in minutes.' },
  ];
  return (
    <section id="how-it-works" className="max-w-5xl mx-auto px-4 pb-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">How It Works</h2>
        <p className="text-[#B0B0C0] text-lg max-w-2xl mx-auto">No code. No setup. Just paste a link and let Execli do the digging.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center text-center group">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2370FF]/20 to-[#9F6BFA]/20 shadow-lg mb-4 backdrop-blur-sm border border-white/20">
              <step.icon size={28} className="text-[#2370FF]" />
            </div>
            <div className="font-semibold text-lg mb-2 text-white">{step.label}</div>
            <div className="text-[#B0B0C0] text-sm">{step.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SampleReportPreview() {
  return (
    <section className="max-w-6xl mx-auto px-4 pb-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">What You'll See In Your Report</h2>
        <p className="text-[#B0B0C0] text-lg max-w-2xl mx-auto">Comprehensive insights delivered in a clear, actionable format</p>
      </div>
      <div className="flex flex-wrap justify-center gap-8 overflow-visible pb-4">
        {[
          { label: 'Executive Summary', graphic: 'bar' },
          { label: 'Trending Topics', graphic: 'line' },
          { label: 'Sentiment Over Time', graphic: 'pie' },
          { label: 'Competitor Comparison', graphic: 'bars' },
          { label: 'Market Gaps', graphic: 'gaps' },
          { label: 'Suggested Actions', graphic: 'actions' },
          { label: 'AI Presentation', graphic: 'ai' },
          { label: 'Key Insights', graphic: 'insights' },
          { label: 'Live Monitoring', graphic: 'monitor' },
          { label: 'Live Alerts in Dips', graphic: 'alert' },
          { label: 'Trust Score', graphic: 'trust' },
          { label: 'Quantitative Signals', graphic: 'quant' },
        ].map((s, i) => (
          <div key={i} className="w-[260px] max-w-xs bg-[#1c1e26]/50 border border-white/10 rounded-3xl shadow-xl p-8 backdrop-blur-2xl flex flex-col items-center justify-center relative hover:scale-[1.06] hover:shadow-2xl transition-all duration-300 group" style={{margin:'16px 0'}}>
            {/* Glassy overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01] rounded-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
            <div className="font-semibold text-lg mb-2 text-white relative z-10 text-center">{s.label}</div>
            <div className="w-full h-20 flex items-center justify-center mb-2 relative z-10">
              {/* On-brand SVGs for each card */}
              {s.graphic === 'bar' && (
                <svg width="80" height="40" viewBox="0 0 80 40" fill="none"><rect x="5" y="20" width="8" height="15" rx="2" fill="#3b82f6" /><rect x="20" y="10" width="8" height="25" rx="2" fill="#7c3aed" /><rect x="35" y="25" width="8" height="10" rx="2" fill="#0891b2" /><rect x="50" y="5" width="8" height="30" rx="2" fill="#9F6BFA" /><rect x="65" y="15" width="8" height="20" rx="2" fill="#2370FF" /></svg>
              )}
              {s.graphic === 'line' && (
                <svg width="80" height="40" viewBox="0 0 80 40" fill="none"><polyline points="5,35 20,30 35,25 50,15 65,10 75,5" fill="none" stroke="#7c3aed" strokeWidth="3" /><circle cx="5" cy="35" r="2" fill="#7c3aed" /><circle cx="20" cy="30" r="2" fill="#7c3aed" /><circle cx="35" cy="25" r="2" fill="#7c3aed" /><circle cx="50" cy="15" r="2" fill="#7c3aed" /><circle cx="65" cy="10" r="2" fill="#7c3aed" /><circle cx="75" cy="5" r="2" fill="#7c3aed" /></svg>
              )}
              {s.graphic === 'pie' && (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="#1e293b" /><path d="M24 24 L24 4 A20 20 0 0 1 44 24 Z" fill="#3b82f6" /><path d="M24 24 L44 24 A20 20 0 0 1 24 44 Z" fill="#7c3aed" /><path d="M24 24 L24 44 A20 20 0 0 1 4 24 Z" fill="#0891b2" /><path d="M24 24 L4 24 A20 20 0 0 1 24 4 Z" fill="#9F6BFA" /></svg>
              )}
              {s.graphic === 'bars' && (
                <svg width="80" height="40" viewBox="0 0 80 40" fill="none"><rect x="10" y="8" width="50" height="6" rx="2" fill="#3b82f6" /><rect x="10" y="18" width="35" height="6" rx="2" fill="#7c3aed" /><rect x="10" y="28" width="60" height="6" rx="2" fill="#0891b2" /></svg>
              )}
              {s.graphic === 'gaps' && (
                <svg width="60" height="40" viewBox="0 0 60 40" fill="none"><circle cx="15" cy="20" r="8" fill="#7c3aed" opacity="0.2" /><rect x="30" y="10" width="8" height="20" rx="2" fill="#3b82f6" /><rect x="42" y="18" width="6" height="12" rx="2" fill="#0891b2" /></svg>
              )}
              {s.graphic === 'actions' && (
                <svg width="60" height="40" viewBox="0 0 60 40" fill="none"><polyline points="10,30 20,38 35,10 50,30" fill="none" stroke="#3b82f6" strokeWidth="3" /><polyline points="35,10 50,30" fill="none" stroke="#7c3aed" strokeWidth="3" /></svg>
              )}
              {s.graphic === 'ai' && (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="#232b4d" /><rect x="14" y="14" width="20" height="20" rx="6" fill="#86EFF5" opacity="0.7" /><circle cx="24" cy="24" r="6" fill="#7c3aed" /></svg>
              )}
              {s.graphic === 'insights' && (
                <svg width="60" height="40" viewBox="0 0 60 40" fill="none"><rect x="10" y="30" width="8" height="8" rx="2" fill="#3b82f6" /><rect x="25" y="20" width="8" height="18" rx="2" fill="#7c3aed" /><rect x="40" y="10" width="8" height="28" rx="2" fill="#86EFF5" /></svg>
              )}
              {s.graphic === 'monitor' && (
                <svg width="60" height="40" viewBox="0 0 60 40" fill="none"><rect x="10" y="10" width="40" height="20" rx="6" fill="#232b4d" /><rect x="18" y="18" width="24" height="4" rx="2" fill="#86EFF5" /></svg>
              )}
              {s.graphic === 'alert' && (
                <svg width="60" height="40" viewBox="0 0 60 40" fill="none"><rect x="10" y="30" width="40" height="6" rx="3" fill="#7c3aed" /><circle cx="30" cy="33" r="8" fill="#f59e42" opacity="0.7" /><rect x="28" y="25" width="4" height="8" rx="2" fill="#fff" /></svg>
              )}
              {s.graphic === 'trust' && (
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <polygon points="20,7 24,16 34,16 26,22 29,32 20,26 11,32 14,22 6,16 16,16" fill="#fbbf24" />
                </svg>
              )}
              {s.graphic === 'quant' && (
                <svg width="60" height="40" viewBox="0 0 60 40" fill="none"><rect x="10" y="30" width="8" height="8" rx="2" fill="#3b82f6" /><rect x="25" y="20" width="8" height="18" rx="2" fill="#7c3aed" /><rect x="40" y="10" width="8" height="28" rx="2" fill="#86EFF5" /><circle cx="54" cy="10" r="4" fill="#f59e42" /></svg>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="max-w-4xl mx-auto px-4 pb-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">Start Free. Pay Only for What You Use.</h2>
        <p className="text-[#B0B0C0] text-lg max-w-2xl mx-auto">Execli is free to try with 1 source + 1 competitor. Want live data or more integrations? Add what you need.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Free Tier */}
        <div className="bg-[#1c1e26]/40 border border-white/20 rounded-3xl p-8 backdrop-blur-2xl relative overflow-hidden">
          {/* Liquid effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01] rounded-3xl" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/5 via-transparent to-[#8b5cf6]/5 rounded-3xl" />
          
          <div className="text-center mb-6 relative z-10">
            <h3 className="text-xl font-bold text-white mb-2">Free</h3>
            <div className="text-3xl font-bold text-[#2370FF] mb-1">$0</div>
            <div className="text-[#B0B0C0] text-sm">forever</div>
          </div>
          <ul className="space-y-3 text-[#B0B0C0] text-sm relative z-10">
            <li className="flex items-center"><CheckCircle size={16} className="text-[#2370FF] mr-2" />1 data source</li>
            <li className="flex items-center"><CheckCircle size={16} className="text-[#2370FF] mr-2" />1 competitor</li>
            <li className="flex items-center"><CheckCircle size={16} className="text-[#2370FF] mr-2" />Static report</li>
          </ul>
        </div>
        
        {/* Live Monitor */}
        <div className="bg-[#1c1e26]/40 border border-[#3b82f6]/30 rounded-3xl p-8 backdrop-blur-2xl relative overflow-hidden">
          {/* Liquid effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01] rounded-3xl" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/10 via-transparent to-[#8b5cf6]/5 rounded-3xl" />
          
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 relative z-10">
            <span className="pill text-xs">Most Popular</span>
          </div>
          <div className="text-center mb-6 relative z-10">
            <h3 className="text-xl font-bold text-white mb-2">Live Monitor</h3>
            <div className="text-3xl font-bold text-[#2370FF] mb-1">$20</div>
            <div className="text-[#B0B0C0] text-sm">per month</div>
          </div>
          <ul className="space-y-3 text-[#B0B0C0] text-sm relative z-10">
            <li className="flex items-center"><CheckCircle size={16} className="text-[#2370FF] mr-2" />Real-time syncing</li>
            <li className="flex items-center"><CheckCircle size={16} className="text-[#2370FF] mr-2" />Alerting</li>
            <li className="flex items-center"><CheckCircle size={16} className="text-[#2370FF] mr-2" />Enable integrations</li>
          </ul>
        </div>
        
        {/* Additional Sources */}
        <div className="bg-[#1c1e26]/40 border border-white/20 rounded-3xl p-8 backdrop-blur-2xl relative overflow-hidden">
          {/* Liquid effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01] rounded-3xl" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#8b5cf6]/5 via-transparent to-[#3b82f6]/5 rounded-3xl" />
          
          <div className="text-center mb-6 relative z-10">
            <h3 className="text-xl font-bold text-white mb-2">Add Sources</h3>
            <div className="text-3xl font-bold text-[#9F6BFA] mb-1">$19-39</div>
            <div className="text-[#B0B0C0] text-sm">per source/month</div>
          </div>
          <ul className="space-y-3 text-[#B0B0C0] text-sm relative z-10">
            <li className="flex items-center"><CheckCircle size={16} className="text-[#9F6BFA] mr-2" />Trustpilot, Amazon</li>
            <li className="flex items-center"><CheckCircle size={16} className="text-[#9F6BFA] mr-2" />Twitter, Reddit</li>
            <li className="flex items-center"><CheckCircle size={16} className="text-[#9F6BFA] mr-2" />And more...</li>
          </ul>
        </div>
      </div>
      <div className="mt-6 text-center text-[#B0B0C0] text-sm">Live Monitor required for additional sources.</div>
    </section>
  );
}

function IntegrationsGrid() {
  const integrations = [
    { name: 'Trustpilot', price: 19, icon: Star },
    { name: 'Yelp', price: 19, icon: Users },
    { name: 'App Store', price: 29, icon: PieChart },
    { name: 'Reddit', price: 19, icon: MessageCircle },
    { name: 'Intercom', price: 29, icon: Mail },
    { name: 'Twitter', price: 39, icon: TrendingUp },
    { name: 'Facebook', price: 29, icon: Users },
    { name: 'Amazon', price: 39, icon: Star },
    { name: 'Google', price: 29, icon: UserCheck },
  ];
  return (
    <section className="max-w-6xl mx-auto px-4 pb-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">Integrations</h2>
        <p className="text-[#B0B0C0] text-lg max-w-2xl mx-auto">Connect to all your customer feedback sources</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {integrations.map((int, i) => (
          <div key={i} className="bg-[#1c1e26]/40 border border-white/20 rounded-3xl p-6 flex flex-col items-center justify-center backdrop-blur-2xl hover:scale-105 transition-all duration-300 group overflow-hidden relative">
            {/* Liquid effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01] rounded-3xl" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/5 via-transparent to-[#8b5cf6]/5 rounded-3xl" />
            
            <int.icon size={32} className="text-[#2370FF] mb-3 group-hover:text-[#9F6BFA] transition-all duration-300 relative z-10" />
            <div className="font-semibold text-base text-white mb-1 relative z-10">{int.name}</div>
            <div className="text-xs text-[#B0B0C0] mb-3 relative z-10">Integration</div>
            <div className="flex items-center gap-2 relative z-10">
              <span className="pill text-xs">${int.price}/mo</span>
              {int.price > 0 && <Lock size={16} className="text-[#86EFF5] opacity-70 group-hover:opacity-100 transition-all duration-300" />}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FAQSection() {
  const faqs = [
    { q: 'Can I try Execli for free?', a: 'Yes! The free tier includes 1 data source, 1 competitor, and a static report.' },
    { q: 'What if I need more than one source?', a: 'You can add more sources individually from the Integrations section, billed per source.' },
    { q: 'Do I need Live Monitor to add integrations?', a: 'Yes, Live Monitor unlocks real-time syncing and enables additional integrations.' },
    { q: 'Can I cancel anytime?', a: 'Absolutely. There are no contracts or commitments.' },
  ];
  return (
    <section className="max-w-3xl mx-auto px-4 pb-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">Frequently Asked Questions</h2>
      </div>
      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-[#1c1e26]/40 border border-white/20 rounded-3xl p-6 backdrop-blur-2xl relative overflow-hidden">
            {/* Liquid effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01] rounded-3xl" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/5 via-transparent to-[#8b5cf6]/5 rounded-3xl" />
            
            <div className="font-semibold text-lg text-white mb-2 relative z-10">{faq.q}</div>
            <div className="text-[#B0B0C0] text-base relative z-10">{faq.a}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="max-w-4xl mx-auto px-4 pb-20">
      <div className="bg-[#1c1e26]/40 border border-white/20 rounded-3xl shadow-2xl p-12 backdrop-blur-2xl relative overflow-hidden text-center">
        {/* Liquid effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01] rounded-3xl" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/5 via-transparent to-[#8b5cf6]/5 rounded-3xl" />
        
        <div className="relative z-10 space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Ready to Turn Reviews Into Revenue?
          </h2>
          <p className="text-xl text-[#B0B0C0] max-w-2xl mx-auto">
            Join thousands of businesses using Execli to understand their customers better and make data-driven decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#form" className="btn-primary px-8 py-4 text-lg font-semibold flex items-center gap-2">
              <Wand2 className="w-5 h-5" />
              Start Free Analysis
            </Link>
            <Link href="/blog" className="btn-secondary px-8 py-4 text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Read Our Blog
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function BlogSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 pb-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">Latest Insights & Tips</h2>
        <p className="text-[#B0B0C0] text-lg max-w-2xl mx-auto">Learn how to leverage customer feedback and improve your business</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {BLOG_POSTS.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="group">
            <article className="bg-[#1c1e26]/40 border border-white/20 rounded-3xl shadow-2xl p-6 backdrop-blur-2xl relative overflow-hidden hover:scale-105 transition-all duration-300 h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01] rounded-3xl" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/5 via-transparent to-[#8b5cf6]/5 rounded-3xl" />
              <div className="relative z-10 space-y-4 h-full flex flex-col">
                <div className="space-y-3">
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="bg-[#3b82f6]/10 text-[#3b82f6] px-2 py-1 rounded-full text-xs">{post.category}</span>
                    <span className="text-[#B0B0C0]">{post.readTime}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white leading-tight group-hover:text-[#3b82f6] transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-[#B0B0C0] text-sm leading-relaxed flex-grow">
                    {post.excerpt}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-4 mt-auto">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-[#3b82f6]/20 rounded-full flex items-center justify-center">
                      <span className="text-[#3b82f6] text-xs font-semibold">
                        {post.author.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <span className="text-[#B0B0C0] text-sm">{post.author}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#B0B0C0] group-hover:text-[#3b82f6] transition-colors" />
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
      <div className="text-center mt-12">
        <Link href="/blog" className="btn-secondary px-8 py-3 text-lg font-semibold flex items-center gap-2 mx-auto w-fit">
          <FileText className="w-5 h-5" />
          View All Articles
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [formValid, setFormValid] = useState(false);
  const [showHighlight, setShowHighlight] = useState(true);
  const highlightTimeout = useRef<NodeJS.Timeout | null>(null);
  const [focusedField, setFocusedField] = useState<'businessUrl' | 'competitorUrl' | 'email' | null>('businessUrl');
  const [businessUrl, setBusinessUrl] = useState('');
  const [competitorUrl, setCompetitorUrl] = useState('');

  useEffect(() => {
    setShowHighlight(true);
    if (highlightTimeout.current) clearTimeout(highlightTimeout.current);
    highlightTimeout.current = setTimeout(() => setShowHighlight(false), 1200);
    return () => {
      if (highlightTimeout.current) clearTimeout(highlightTimeout.current);
    };
  }, []);

  const getFaviconUrl = (domain: string) => domain ? `https://www.google.com/s2/favicons?domain=${domain}` : '';

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-[#1c1e26]/60 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 flex items-center h-16 justify-between">
          <div className="flex items-center">
            <img src="/logo.svg" alt="Execli" className="h-7 w-auto py-1" />
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {NAV_LINKS.map((link, i) =>
              !link.dropdown ? (
                <Link key={i} href={link.href} className="px-2 py-1.5 rounded-md hover:bg-white/10 transition-all duration-300 text-[#B0B0C0] hover:text-white text-sm font-medium">{link.label}</Link>
              ) : (
                <div key={i} className="relative group" onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
                  <button className="px-2 py-1.5 rounded-md hover:bg-white/10 transition-all duration-300 flex items-center space-x-1 text-[#B0B0C0] hover:text-white text-sm font-medium">
                    <span>{link.label}</span>
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {showDropdown && (
                    <div className="absolute left-0 mt-2 w-40 bg-[#1c1e26]/90 border border-white/20 rounded-xl shadow-2xl backdrop-blur-2xl">
                      {link.dropdown.map((item, j) => (
                        <Link key={j} href={item.href} className="block px-4 py-2 hover:bg-white/10 transition-all duration-300 text-[#B0B0C0] hover:text-white text-sm">{item.label}</Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/login" className="px-3 py-1.5 rounded-md btn-secondary text-sm">Sign In</Link>
            <Link href="#form" className="px-3 py-1.5 rounded-md btn-primary text-sm font-semibold flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              Generate Report
            </Link>
          </div>
        </div>
      </nav>
      <div className="min-h-screen bg-[#0f1117]/75 text-[#f3f4f6] font-sans relative overflow-x-hidden">
        {/* Enhanced Background */}
        <div className="fixed inset-0 -z-10">
          {/* Radial gradient/vignette for depth */}
          <div className="absolute inset-0 bg-[#0f1117]" />
          <div className="absolute inset-0 bg-gradient-radial" />
          {/* More visible animated flowing gradient */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[1200px] h-[900px] animate-gradient-shift blur-3xl" />
          {/* One major glow per quadrant, harmonized indigo-aqua */}
          <div className="absolute left-0 bottom-0 w-[500px] h-[400px] bg-gradient-to-tr from-[#232b4d]/40 to-[#86EFF5]/20 blur-2xl opacity-40" />
          <div className="absolute right-0 top-1/3 w-[400px] h-[300px] bg-gradient-to-bl from-[#3b82f6]/20 to-transparent blur-2xl opacity-30" />
          {/* Top Fade Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-transparent" />
        </div>
        
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center min-h-[90vh] px-4 pt-16 pb-8 relative">
          <div className="max-w-7xl w-full flex flex-col md:flex-row md:items-center md:justify-between gap-16 relative z-10">
            {/* Left: Headline and Subheadline */}
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left mb-10 md:mb-0 relative">
              {/* Accent Glow Trail behind headline */}
              <div className="absolute -z-10 left-0 top-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-gradient-to-r from-[#8b5cf6]/30 via-[#3b82f6]/25 to-transparent blur-3xl opacity-80 animate-subtle-pulse" />
              
              <h1 className="text-[2.2rem] md:text-[2.8rem] lg:text-[3.5rem] font-bold tracking-tight leading-tight mb-6 text-white relative">
                Drowning in Reviews?<br />
                Turn Feedback Into <span className="whitespace-nowrap"><span className="bg-gradient-to-r from-[#3b82f6] via-[#8b5cf6] to-[#3b82f6] bg-clip-text text-transparent animate-gradient-shift">insights</span>, Instantly.</span>
              </h1>
              <p className="text-sm md:text-base text-[#B0B0C0] font-mono mb-8 tracking-wide leading-snug max-w-xl">
                Execli analyzes customer reviews across platforms and delivers clear insights so you know what to fix, build, or brag about — no analyst needed.
              </p>
              {/* Trust Row */}
              <div className="flex flex-col items-center md:items-start w-full mt-4">
                <div className="text-sm text-[#B0B0C0] mb-2">Trusted by teams at</div>
                <div className="flex flex-wrap gap-6 items-center">
                  {["/logos/stripe.svg","/logos/notion.svg","/logos/figma.svg","/logos/linear.svg","/logos/vercel.svg"].map((src, i) => (
                    <img key={i} src={src} alt="Logo" className="h-7 w-auto opacity-40 grayscale contrast-75 hover:opacity-70 hover:grayscale-0 transition" style={{maxWidth: 100}} />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right: Form Card + Visual */}
            <div className="flex flex-col items-center justify-center w-full max-w-md md:w-[380px] gap-8 relative">
              {/* Hero Glow Background - Enhanced with pulsing */}
              <div className="absolute -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[340px] bg-gradient-radial bg-gradient-radial-from-purple bg-gradient-radial-to-transparent blur-3xl opacity-80 pointer-events-none animate-glow-pulse" />
              
              <div className="w-full">
                <div className="bg-[#1c1e26]/40 border border-white/20 rounded-3xl shadow-2xl p-8 mx-auto backdrop-blur-2xl relative overflow-hidden">
                  {/* Liquid effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01] rounded-3xl" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/5 via-transparent to-[#8b5cf6]/5 rounded-3xl" />
                  
                  {!submitted ? (
                    <form className="flex flex-col gap-6 relative z-10" onSubmit={e => { e.preventDefault(); setSubmitted(true); }} onChange={e => {
                      const form = e.currentTarget as HTMLFormElement;
                      setFormValid(form.checkValidity());
                    }}>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-[#B0B0C0] font-medium mb-1">Step 1</span>
                        <label htmlFor="businessUrl" className={`font-semibold text-base mb-1 ${focusedField === 'businessUrl' ? 'field-label-active' : 'field-label-faded'}`}>Paste Business URL</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                            {businessUrl && businessUrl.match(/^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/) ? (
                              <img src={getFaviconUrl(businessUrl)} alt="favicon" className="w-4 h-4 rounded" />
                            ) : (
                              <Globe className="w-4 h-4 text-[#B0B0C0]" />
                            )}
                            <span className="text-[#B0B0C0] select-none">https://</span>
                          </span>
                          <input
                            id="businessUrl"
                            name="businessUrl"
                            type="text"
                            required
                            placeholder="yourbusiness.com"
                            className="input-field pl-32"
                            autoComplete="off"
                            autoFocus
                            value={businessUrl}
                            onFocus={() => setFocusedField('businessUrl')}
                            onBlur={() => setFocusedField(null)}
                            onChange={e => setBusinessUrl(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-[#B0B0C0] font-medium mb-1">Step 2 <span className="text-xs text-[#B0B0C0]/60">(optional)</span></span>
                        <label htmlFor="competitorUrl" className={`font-semibold text-base mb-1 ${focusedField === 'competitorUrl' ? 'field-label-active' : 'field-label-faded'}`}>Add 1 Competitor</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                            {businessUrl && businessUrl.match(/^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/) ? (
                              <img src={getFaviconUrl(competitorUrl)} alt="favicon" className="w-4 h-4 rounded" />
                            ) : (
                              <Globe className="w-4 h-4 text-[#B0B0C0]" />
                            )}
                            <span className="text-[#B0B0C0] select-none">https://</span>
                          </span>
                          <input
                            id="competitorUrl"
                            name="competitorUrl"
                            type="text"
                            placeholder="competitor.com"
                            className="input-field pl-32"
                            autoComplete="off"
                            value={competitorUrl}
                            onChange={e => setCompetitorUrl(e.target.value)}
                            onFocus={() => setFocusedField('competitorUrl')}
                            onBlur={() => setFocusedField(null)}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-[#B0B0C0] font-medium mb-1">Step 3</span>
                        <label htmlFor="email" className={`font-semibold text-base mb-1 ${focusedField === 'email' ? 'field-label-active' : 'field-label-faded'}`}>Email Address</label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="you@example.com"
                          className="input-field"
                          autoComplete="off"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                        />
                      </div>
                      <div className="flex flex-col gap-2 mt-2">
                        <button
                          type="submit"
                          className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 font-bold text-base shadow-lg transition-all duration-300 focus:ring-2 focus:ring-[#2370FF] focus:ring-offset-2 relative z-10 ${formValid ? 'btn-primary' : 'btn-ghost'}`}
                          disabled={!formValid}
                        >
                          <Wand2 className="w-5 h-5" />
                          Generate Free Report
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col items-center justify-center min-h-[200px] relative z-10">
                      <h2 className="text-2xl font-semibold mb-4 text-white">We're analyzing your customer voice.</h2>
                      <p className="text-lg text-[#B0B0C0]">Your VOC report will be delivered to <span className="text-[#2370FF] font-semibold">{email}</span> in under 1 minute.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* How it Works Section */}
        <HowItWorks />
        
        {/* Sample Report Preview */}
        <SampleReportPreview />
        
        {/* Pricing Section */}
        <PricingSection />
        
        {/* Integrations Grid */}
        <IntegrationsGrid />
        
        {/* Blog Section */}
        <BlogSection />
        
        {/* FAQ Section */}
        <FAQSection />
        
        {/* CTA Section */}
        <CTASection />
        
        {/* Trust Logos */}
        <section className="max-w-3xl mx-auto px-4 pb-16">
          <div className="text-center text-[#B0B0C0] font-medium mb-6">Trusted by marketing teams and product managers at</div>
          <div className="flex flex-wrap justify-center items-center gap-8 grayscale opacity-60">
            {["/logos/stripe.svg","/logos/notion.svg","/logos/figma.svg","/logos/linear.svg","/logos/vercel.svg"].map((src, i) => (
              <div key={i} className="h-10 flex items-center transition duration-200 hover:filter-none hover:opacity-100">
                <img src={src} alt="Logo" className="h-8 w-auto object-contain" style={{maxWidth: 120}} />
              </div>
            ))}
          </div>
        </section>
        
        {/* Footer */}
        <footer className="w-full py-8 text-center text-[#B0B0C0] text-sm border-t border-white/10 bg-transparent">
          &copy; {new Date().getFullYear()} Execli. All rights reserved.
        </footer>
      </div>
    </>
  )
} 