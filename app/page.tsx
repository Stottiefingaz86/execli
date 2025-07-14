'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Navigation from '../components/Navigation'
import { CheckCircle, Mail, BarChart2, Users, Lock, Zap, FileText, TrendingUp, PieChart, Shield, Star, MessageCircle, UserCheck, ArrowRight, Wand2, Globe } from 'lucide-react';
import PlatformSelection from '../components/PlatformSelection'
import ErrorPage from '../components/ErrorPage'

const VERSION = 'v0.1.0-deploy-20240714';

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
    { href: '/blog', label: 'Blog' },
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

const REVIEW_SOURCES = [
  { value: '', label: 'Select a review source', icon: <Globe className="w-5 h-5 text-[#B0B0C0]" /> },
  { value: 'trustpilot', label: 'Trustpilot', icon: <Star className="w-5 h-5 text-[#3b82f6]" /> },
  { value: 'google', label: 'Google Reviews', icon: <Globe className="w-5 h-5 text-[#34a853]" /> },
  { value: 'yelp', label: 'Yelp', icon: (
    <svg className="w-5 h-5 text-[#d32323]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ) },
  { value: 'tripadvisor', label: 'TripAdvisor', icon: (
    <svg className="w-5 h-5 text-[#34e0a1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ) },
  { value: 'booking', label: 'Booking.com', icon: (
    <svg className="w-5 h-5 text-[#003580]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ) },
  { value: 'expedia', label: 'Expedia', icon: (
    <svg className="w-5 h-5 text-[#f5c518]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ) },
  { value: 'g2', label: 'G2', icon: (
    <svg className="w-5 h-5 text-[#ff6f00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ) },
  { value: 'capterra', label: 'Capterra', icon: (
    <svg className="w-5 h-5 text-[#2e6cff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ) },
  { value: 'twitter', label: 'X (Twitter)', icon: (
    <svg className="w-5 h-5 text-[#1da1f2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ) },
  { value: 'amazon', label: 'Amazon', icon: (
    <svg className="w-5 h-5 text-[#ff9900]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ) },
  { value: 'reddit', label: 'Reddit', icon: <MessageCircle className="w-5 h-5 text-[#ff4500]" /> },
  { value: 'facebook', label: 'Facebook', icon: <FileText className="w-5 h-5 text-[#1877f3]" /> },
  { value: 'other', label: 'Other', icon: <Globe className="w-5 h-5 text-[#B0B0C0]" /> },
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
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400/20 to-[#9F6BFA]/20 shadow-lg mb-4 backdrop-blur-sm border border-white/20">
              <step.icon size={28} className="text-purple-400" />
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
          { label: 'Executive Summary', graphic: 'bar', desc: 'A high-level summary of key customer sentiment and review trends.' },
          { label: 'Trending Topics', graphic: 'line', desc: 'The most discussed themes and issues in recent customer feedback.' },
          { label: 'Sentiment Over Time', graphic: 'pie', desc: 'How customer sentiment changes month by month.' },
          { label: 'Competitor Comparison', graphic: 'bars', desc: 'See how you stack up against competitors on major review topics.' },
          { label: 'Market Gaps', graphic: 'gaps', desc: 'Opportunities and unmet needs found in your market.' },
          { label: 'Suggested Actions', graphic: 'actions', desc: 'AI-powered recommendations to improve your product or service.' },
          { label: 'AI Presentation', graphic: 'ai', desc: 'Auto-generated slides for sharing insights with your team.' },
          { label: 'Key Insights', graphic: 'insights', desc: 'Notable trends, wins, and risks surfaced from your reviews.' },
          { label: 'Live Monitoring', graphic: 'monitor', desc: 'Real-time alerts and updates as new reviews come in.' },
          { label: 'Live Alerts in Dips', graphic: 'alert', desc: 'Instant notifications when sentiment or volume drops.' },
          { label: 'Trust Score', graphic: 'trust', desc: 'A single score reflecting your brand’s reputation and reliability.' },
          { label: 'Quantitative Signals', graphic: 'quant', desc: 'Hard metrics like complaint rates and resolution times.' },
        ].map((s, i) => (
          <div key={i} className="w-[260px] max-w-xs bg-[#1c1e26]/50 border border-white/10 rounded-3xl shadow-xl p-8 backdrop-blur-2xl flex flex-col items-center justify-center relative hover:scale-[1.06] hover:shadow-2xl transition-all duration-300 group" style={{margin:'16px 0'}}>
            {/* Glassy overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01] rounded-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/5 via-transparent to-[#8b5cf6]/5 rounded-3xl" />
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
            <div className="text-xs text-[#B0B0C0] text-center mt-1 relative z-10">{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="max-w-5xl mx-auto px-4 pb-12 pt-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">Start Free. Pay Only for What You Use.</h2>
        <p className="text-[#B0B0C0] text-lg max-w-2xl mx-auto">Execli is free to try with 1 source + 1 competitor. Want live data or more integrations? Add what you need.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Free Tier */}
        <div className="bg-[#181a20] border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col justify-between min-h-[340px]">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-white mb-1">Free</h3>
            <div className="text-3xl font-bold text-white mb-1">$0</div>
            <div className="text-[#B0B0C0] text-sm">forever</div>
          </div>
          <ul className="space-y-3 text-[#B0B0C0] text-sm mb-4">
            <li className="flex items-center"><CheckCircle size={18} className="text-white mr-2" />1 review source</li>
            <li className="flex items-center"><CheckCircle size={18} className="text-white mr-2" />1 competitor</li>
          </ul>
          <button className="mt-2 w-full py-3 rounded-lg border border-white text-white font-semibold text-base bg-transparent hover:bg-white hover:text-[#181a20] transition">Get Started</button>
        </div>
        {/* Pro Tier with rounded gradient border */}
        <div className="relative flex flex-col justify-between scale-105 z-10 min-h-[340px]">
          <div className="absolute inset-0 -z-10 rounded-2xl p-[2px] brand-gradient"></div>
          <div className="bg-[#202a3c] rounded-2xl p-6 shadow-xl flex flex-col h-full">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="px-4 py-1 rounded-full text-xs font-semibold shadow border border-white/20 text-white brand-gradient">Most Popular</span>
          </div>
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-white mb-1">Pro</h3>
              <div className="text-3xl font-bold text-white mb-1">$20</div>
            <div className="text-[#B0B0C0] text-sm">per month</div>
            </div>
            <ul className="space-y-3 text-[#B0B0C0] text-sm mb-4">
              <li className="flex items-center"><CheckCircle size={18} className="text-white mr-2" />1 report</li>
              <li className="flex items-center"><CheckCircle size={18} className="text-white mr-2" />2 sources</li>
              <li className="flex items-center"><CheckCircle size={18} className="text-white mr-2" />4 competitors</li>
              <li className="flex items-center"><CheckCircle size={18} className="text-white mr-2" />Live monitor (real-time review syncs)</li>
            </ul>
            <button className="mt-2 w-full py-3 rounded-lg font-semibold text-base border-none brand-gradient text-white">Subscribe</button>
          </div>
        </div>
        {/* Enterprise Tier */}
        <div className="bg-[#181a20] border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col justify-between min-h-[340px]">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-white mb-1">Enterprise</h3>
            <div className="text-3xl font-bold text-purple-400 mb-1">Custom</div>
            <div className="text-[#B0B0C0] text-sm">pricing</div>
          </div>
          <ul className="space-y-3 text-[#B0B0C0] text-sm mb-4">
            <li className="flex items-center"><CheckCircle size={18} className="text-white mr-2" />Everything in Pro</li>
            <li className="flex items-center"><CheckCircle size={18} className="text-white mr-2" />Multiple reports</li>
            <li className="flex items-center"><CheckCircle size={18} className="text-white mr-2" />Onsite chat integration</li>
            <li className="flex items-center"><CheckCircle size={18} className="text-white mr-2" />Account manager</li>
          </ul>
          <button className="mt-2 w-full py-3 rounded-lg border border-white text-white font-semibold text-base bg-transparent hover:bg-white hover:text-[#181a20] transition">Contact Sales</button>
        </div>
      </div>
    </section>
  );
}

function IntegrationsGrid() {
  // Full list of integrations from REVIEW_SOURCES and modal
  const integrations = [
    { name: 'Trustpilot', price: 9, icon: Star },
    { name: 'App Store', price: 9, icon: PieChart },
    { name: 'Yelp', price: 9, icon: Users },
    { name: 'Reddit', price: 9, icon: MessageCircle },
    { name: 'Twitter', price: 9, icon: TrendingUp },
    { name: 'Facebook', price: 9, icon: Users },
    { name: 'Amazon', price: 9, icon: Star },
    { name: 'Google Reviews', price: 9, icon: UserCheck },
    { name: 'Expedia', price: 9, icon: Globe },
    { name: 'Booking.com', price: 9, icon: Globe },
    { name: 'Capterra', price: 9, icon: Globe },
    { name: 'G2', price: 9, icon: Globe },
    { name: 'TripAdvisor', price: 9, icon: Globe },
    { name: 'Casino.org', price: 9, icon: Globe },
    { name: 'Intercom', price: 'Custom', icon: Mail },
    { name: 'Zendesk', price: 'Custom', icon: Mail },
    { name: 'LiveChat', price: 'Custom', icon: Mail },
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
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/5 via-transparent to-[#8b5cf6]/5 rounded-3xl" />
            <int.icon size={32} className="text-purple-400 mb-3 group-hover:text-[#9F6BFA] transition-all duration-300 relative z-10" />
            <div className="font-semibold text-base text-white mb-1 relative z-10">{int.name}</div>
            <div className="text-xs text-[#B0B0C0] mb-3 relative z-10">Integration</div>
            <div className="flex items-center gap-2 relative z-10">
              <span className="pill text-xs">{int.price === 'Custom' ? 'Custom' : `€${int.price}/mo`}</span>
              {int.price !== 0 && <Lock size={16} className="text-[#86EFF5] opacity-70 group-hover:opacity-100 transition-all duration-300" />}
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
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/5 via-transparent to-[#8b5cf6]/5 rounded-3xl" />
            
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
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/5 via-transparent to-[#8b5cf6]/5 rounded-3xl" />
        
        <div className="relative z-10 space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Ready to Turn Reviews Into Revenue?
          </h2>
          <p className="text-xl text-[#B0B0C0] max-w-2xl mx-auto">
            Join thousands of businesses using Execli to understand their customers better and make data-driven decisions.
          </p>
          {/* CTA Buttons Row */}
          <div className="flex flex-row gap-4 mb-6">
            <a
              href="/report"
                      className="btn-primary"
            >
              Demo Report
            </a>
            <a
              href="/signup"
              className="px-4 py-2 rounded-lg bg-white text-[#181a20] font-medium text-sm shadow-sm border border-white/20 hover:bg-gray-100 transition flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/40 focus:ring-offset-2"
              style={{ boxShadow: '0 2px 12px 0 rgba(139,92,246,0.08)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              Get Started
            </a>
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
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/5 via-transparent to-[#8b5cf6]/5 rounded-3xl" />
              <div className="relative z-10 space-y-4 h-full flex flex-col">
                <div className="space-y-3">
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="bg-purple-400/10 text-purple-400 px-2 py-1 rounded-full text-xs">{post.category}</span>
                    <span className="text-[#B0B0C0]">{post.readTime}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white leading-tight group-hover:text-purple-400 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-[#B0B0C0] text-sm leading-relaxed flex-grow">
                    {post.excerpt}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-4 mt-auto">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-purple-400/20 rounded-full flex items-center justify-center">
                      <span className="text-purple-400 text-xs font-semibold">
                        {post.author.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <span className="text-[#B0B0C0] text-sm">{post.author}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#B0B0C0] group-hover:text-purple-400 transition-colors" />
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

function detectPlatform(url: string) {
  if (!url) return null;
  if (url.includes('trustpilot.com')) return { name: 'Trustpilot', icon: <Star className="w-4 h-4 text-[#3b82f6]" /> };
  if (url.includes('reddit.com')) return { name: 'Reddit', icon: <MessageCircle className="w-4 h-4 text-[#ff4500]" /> };
  if (url.includes('google.com/maps/place')) return { name: 'Google Reviews', icon: <Globe className="w-4 h-4 text-[#34a853]" /> };
  if (url.includes('facebook.com')) return { name: 'Facebook', icon: <FileText className="w-4 h-4 text-[#1877f3]" /> };
  return { name: 'Other', icon: <Globe className="w-4 h-4 text-[#B0B0C0]" /> };
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
  const [reviewSource, setReviewSource] = useState('');
  const [reviewSourceUrl, setReviewSourceUrl] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  // Polling loader state
  const [polling, setPolling] = useState(false);
  const [pollingError, setPollingError] = useState<string | null>(null);
  const [pollingEmail, setPollingEmail] = useState('');
  // Error state
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  // Platform detection state
  const [detectingPlatforms, setDetectingPlatforms] = useState(false);
  const [industry, setIndustry] = useState('');

  useEffect(() => {
    setShowHighlight(true);
    if (highlightTimeout.current) clearTimeout(highlightTimeout.current);
    highlightTimeout.current = setTimeout(() => setShowHighlight(false), 1200);
    return () => {
      if (highlightTimeout.current) clearTimeout(highlightTimeout.current);
    };
  }, []);

  const getFaviconUrl = (domain: string) => domain ? `https://www.google.com/s2/favicons?domain=${domain}` : '';

  // Polling function
  async function pollReportStatus(reportId: string, maxAttempts = 30) {
    let attempts = 0;
    setPolling(true);
    setPollingError(null);
    while (attempts < maxAttempts) {
      try {
        const res = await fetch(`/api/report-status?report_id=${reportId}`);
        const data = await res.json();
        if (data.status === 'complete' && data.report_url) {
          window.location.href = data.report_url;
          return;
        }
        if (data.status === 'error') {
          setErrorMessage('There was an error generating your report. Please try again.');
          setHasError(true);
          setPolling(false);
          setSubmitted(false);
          return;
        }
      } catch (err) {
        setErrorMessage('Network error. Please try again.');
        setHasError(true);
        setPolling(false);
        setSubmitted(false);
        return;
      }
      await new Promise(res => setTimeout(res, 3000));
      attempts++;
    }
    setErrorMessage('Report generation timed out. Please try again.');
    setHasError(true);
    setPolling(false);
    setSubmitted(false);
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-[#0f1117]/80 text-[#f3f4f6] font-sans relative overflow-x-hidden">
        {/* Enhanced Background */}
        <div className="fixed inset-0 -z-10">
          {/* Radial gradient/vignette for depth */}
          <div className="absolute inset-0 bg-[#0f1117]" />
          <div className="absolute inset-0 bg-gradient-radial" />
          {/* More visible animated flowing gradient */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[1200px] h-[900px] animate-gradient-shift blur-3xl" />
          {/* One major glow per quadrant, harmonized indigo-aqua */}
          <div className="absolute left-0 bottom-0 w-[500px] h-[400px] bg-gradient-to-tr from-[#232b4d]/40 to-[#86EFF5]/20 blur-2xl opacity-40" />
          <div className="absolute right-0 top-1/3 w-[400px] h-[300px] bg-gradient-to-bl from-purple-400/10 to-transparent blur-2xl opacity-40" />
          {/* Top Fade Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-transparent" />
        </div>
        
        {/* Error Page */}
        {hasError && (
          <ErrorPage 
            message={errorMessage}
            showRetry={true}
            onRetry={() => {
              setHasError(false);
              setErrorMessage('');
              setSubmitted(false);
            }}
          />
        )}

        {/* Main Content */}
        {!hasError && (
          <section className="relative z-10">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
                {/* Left: Hero Content */}
                <div className="flex-1 min-w-0 space-y-8">
              <h1 className="text-[2.2rem] md:text-[2.8rem] lg:text-[3.5rem] font-bold tracking-tight leading-tight mb-6 text-white relative">
                Drowning in Reviews?<br />
                Turn Feedback Into <span className="whitespace-nowrap"><span className="bg-gradient-to-r from-[#3b82f6] via-[#8b5cf6] to-[#3b82f6] bg-clip-text text-transparent animate-gradient-shift">insights</span>, Instantly.</span>
              </h1>
              <p className="text-sm md:text-base text-[#B0B0C0] font-mono mb-8 tracking-wide leading-snug max-w-xl">
                Execli analyzes customer reviews across platforms and delivers clear insights so you know what to fix, build, or brag about — no analyst needed.
              </p>
              {/* CTA Buttons Row */}
              <div className="flex flex-row gap-4 mb-6">
                <a
                  href="/report"
                      className="btn-primary"
                >
                  Demo Report
                </a>
                <a
                  href="/signup"
                  className="px-4 py-2 rounded-lg bg-white text-[#181a20] font-medium text-sm shadow-sm border border-white/20 hover:bg-gray-100 transition flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/40 focus:ring-offset-2"
                  style={{ boxShadow: '0 2px 12px 0 rgba(139,92,246,0.08)' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  Get Started
                </a>
              </div>
            </div>
            
            {/* Right: Form Card + Visual */}
                <div className="w-full md:w-[380px] lg:w-[420px] flex-shrink-0 flex flex-col justify-center gap-8 relative px-4">
              {/* Hero Glow Background - Enhanced with pulsing */}
              <div className="absolute -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[340px] bg-gradient-radial bg-gradient-radial-from-purple bg-gradient-radial-to-transparent blur-3xl opacity-80 pointer-events-none animate-glow-pulse" />
              
              <div className="w-full max-w-full md:max-w-md md:w-[380px]">
                <div className="bg-[#1c1e26]/40 border border-white/20 rounded-3xl shadow-2xl p-8 mx-auto backdrop-blur-2xl relative overflow-hidden max-w-xl w-full">
                  {/* Liquid effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01] rounded-3xl" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/5 via-transparent to-[#8b5cf6]/5 rounded-3xl" />
                  
                  {!submitted ? (
                    <form className="flex flex-col gap-5 md:gap-6 relative z-10" onSubmit={async (e) => { 
                      e.preventDefault(); 
                      setSubmitted(true);
                      setPollingEmail(email);
                      setPolling(false);
                      setPollingError(null);
                      try {
                        const response = await fetch('/api/scrape', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            business_name: businessUrl,
                            business_url: `https://${reviewSourceUrl}`,
                            email: email,
                            industry: industry,
                            selected_platforms: [] // or default to all, or empty
                          })
                        });
                        const result = await response.json();
                        if (result.report_id) {
                          window.location.href = `/report/${result.report_id}`;
                          return;
                        }
                        let fullError = result.error;
                        if (result.stack) {
                          fullError += '\n' + result.stack;
                        }
                        setErrorMessage(fullError || 'Unexpected error. Please try again.');
                        setHasError(true);
                        setSubmitted(false);
                      } catch {
                        setErrorMessage('Error submitting form. Please try again.');
                        setHasError(true);
                        setSubmitted(false);
                      }
                    }} onChange={e => {
                      const form = e.currentTarget as HTMLFormElement;
                      setFormValid(form.checkValidity());
                    }}>
                          {/* Brand Name */}
                      <div className="flex flex-col gap-2 mb-4">
                            <label htmlFor="brandName" className={`font-semibold text-base mb-1 ${focusedField === 'businessUrl' ? 'field-label-active' : 'field-label-faded'}`}>Brand Name</label>
                          <input
                              id="brandName"
                              name="brandName"
                            type="text"
                            required
                              placeholder="Your brand name"
                              className="input-field"
                            autoComplete="off"
                            autoFocus
                            value={businessUrl}
                            onFocus={() => setFocusedField('businessUrl')}
                            onBlur={() => setFocusedField(null)}
                            onChange={e => setBusinessUrl(e.target.value)}
                          />
                        </div>
                          {/* Brand URL (optional) */}
                          <div className="flex flex-col gap-2 mb-4">
                            <label htmlFor="brandUrl" className={`font-semibold text-base mb-1 ${focusedField === 'competitorUrl' ? 'field-label-active' : 'field-label-faded'}`}>Brand URL <span className="text-xs text-[#B0B0C0]">(optional)</span></label>
                            <div className="flex items-center relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B0C0] select-none pointer-events-none text-base">https://</span>
                              <input
                                id="brandUrl"
                                name="brandUrl"
                                type="text"
                                placeholder="yourbrand.com"
                                className="input-field pl-20 pr-12 w-full"
                                autoComplete="off"
                                value={reviewSourceUrl}
                                onFocus={() => setFocusedField('competitorUrl')}
                                onBlur={() => setFocusedField(null)}
                                onChange={e => setReviewSourceUrl(e.target.value.replace(/^https?:\/\//, ''))}
                              />
                              {reviewSourceUrl && (
                                <img
                                  src={`https://www.google.com/s2/favicons?domain=${reviewSourceUrl}`}
                                  alt="favicon"
                                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded"
                                  style={{ background: '#fff', borderRadius: '6px' }}
                                />
                          )}
                        </div>
                      </div>
                      {/* Industry */}
                      <div className="flex flex-col gap-2 mb-4">
                        <label htmlFor="industry" className="font-semibold text-base mb-1">Industry <span className="text-xs text-[#B0B0C0]">(optional)</span></label>
                        <input
                          id="industry"
                          name="industry"
                          type="text"
                          placeholder="e.g. Retail, SaaS, Hospitality"
                          className="input-field"
                          autoComplete="off"
                          value={industry}
                          onChange={e => setIndustry(e.target.value)}
                        />
                      </div>
                      {/* Email Address */}
                      <div className="flex flex-col gap-2">
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
                      {/* Info Text */}
                      <div className="text-xs text-[#B0B0C0] bg-white/5 border border-white/10 rounded-md px-4 py-3 mt-1 mb-2">
                        Sign up to unlock <span className="font-semibold text-white">live monitoring</span>, <span className="font-semibold text-white">more sources</span>, and <span className="font-semibold text-white">competitor tracking</span>.
                      </div>
                      {/* Submit Button */}
                      <div className="flex flex-col gap-2 mt-2">
                        <button
                          type="submit"
                              className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 font-bold text-base shadow-lg transition-all duration-300 focus:ring-2 focus:ring-[#2370FF] focus:ring-offset-2 relative z-10 ${formValid ? 'bg-white text-[#181a20] border border-white/20 hover:bg-gray-100' : 'btn-ghost'}`}
                              style={formValid ? { boxShadow: '0 2px 12px 0 rgba(139,92,246,0.08)' } : {}}
                          disabled={!formValid}
                        >
                          <Wand2 className="w-5 h-5" />
                          Generate Free Report
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col items-center justify-center min-h-[200px] relative z-10">
                          {detectingPlatforms ? (
                            <>
                              <div className="flex flex-col items-center gap-4">
                                <svg className="animate-spin h-10 w-10 text-[#3b82f6]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                </svg>
                                <h2 className="text-2xl font-semibold mb-2 text-white">Detecting review platforms...</h2>
                                <p className="text-lg text-[#B0B0C0]">We're searching for reviews across all platforms.</p>
                              </div>
                            </>
                          ) : polling ? (
                            <>
                              <div className="flex flex-col items-center gap-4">
                                <svg className="animate-spin h-10 w-10 text-[#3b82f6]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                </svg>
                                <h2 className="text-2xl font-semibold mb-2 text-white">We're analyzing your customer voice.</h2>
                                <p className="text-lg text-[#B0B0C0]">Your VOC report will be delivered to <span className="text-[#2370FF] font-semibold">{pollingEmail}</span> in under 1 minute.</p>
                                <p className="text-sm text-[#B0B0C0]">This may take up to 60 seconds. Please keep this page open.</p>
                              </div>
                            </>
                          ) : pollingError ? (
                            <div className="flex flex-col items-center gap-4">
                              <h2 className="text-2xl font-semibold mb-2 text-red-400">{pollingError}</h2>
                              <button className="btn-primary" onClick={() => { setSubmitted(false); setPollingError(null); }}>Try Again</button>
                            </div>
                          ) : (
                            <>
                      <h2 className="text-2xl font-semibold mb-4 text-white">We're analyzing your customer voice.</h2>
                              <p className="text-lg text-[#B0B0C0]">Your VOC report will be delivered to <span className="text-[#2370FF] font-semibold">{pollingEmail}</span> in under 1 minute.</p>
                            </>
                          )}
                    </div>
                  )}
                    </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        )}
        
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
        <footer className="w-full py-8 text-center text-[#B0B0C0] text-sm border-t border-white/10 bg-transparent">
          &copy; {new Date().getFullYear()} Execli. All rights reserved. | Version: {VERSION}
        </footer>
      </div>
    </>
  )
} 